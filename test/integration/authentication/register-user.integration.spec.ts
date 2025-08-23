import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validUserRegistration, invalidUserRegistration } from '@/test/fixtures/user-fixtures';

// Use chai.use() correctly
chai.use(chaiHttp);

describe('Register User Integration Tests', () => {
  describe('POST /api/v1/auth/register', () => {

    beforeEach(async () => {
      await PatientModel.deleteOne({ email: validUserRegistration.email });
    });

    it('should register a new user successfully', async () => {
      // Act - Use chai.request directly (without any type casting)
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/register')
        .send(validUserRegistration);

      console.log("response", response.body);

      // Assert
      expect(response).to.have.status(201);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.equal('User registered successfully');
      expect(response.body.data.userId).to.be.a('string');
      expect(response.body.data.email).to.equal(validUserRegistration.email);
      expect(response.body.data.userType).to.equal(validUserRegistration.userType);
      expect(response.body.data.isVerified).to.be.false;

      // Verify user was created in database
      const user: any = await PatientModel.findOne({ email: validUserRegistration.email });
      expect(user).to.not.be.null;
      expect(user.email).to.equal(validUserRegistration.email);
      expect(user.firstName).to.equal(validUserRegistration.firstName);
      expect(user.lastName).to.equal(validUserRegistration.lastName);
    });

    it('should return error for duplicate email', async () => {
      // Arrange - create first user
      await (chai as any).request(app)
        .post('/api/v1/auth/register')
        .send(validUserRegistration);

      // Act - try to create user with same email
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/register')
        .send(validUserRegistration);

      // Assert
      expect(response).to.have.status(409);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal('Email already exists');
      expect(response.body.error).to.equal('USER_003');
    });

    it('should return error for invalid input data', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/register')
        .send(invalidUserRegistration);

      // Assert
      expect(response).to.have.status(400);
      expect(response.body.success).to.be.false;
      const validMessages = [
        'Invalid input data',
        'Missing required fields: firstName',
        'Missing required fields'
      ];
      expect(validMessages).to.include(response.body.message);
      expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
    });

     it('should return error for empty request body', async () => {
     // Act
     const response = await (chai as any).request(app)
       .post('/api/v1/auth/register')
       .send({});

     // Assert
     expect(response).to.have.status(400);
     expect(response.body.success).to.be.false;
     expect(response.body.message).to.equal('Request body is empty');
     expect(response.body.error).to.equal('EMPTY_REQUEST_BODY');
   });

   it('should return error for missing required fields', async () => {
     // Act
     const response = await (chai as any).request(app)
       .post('/api/v1/auth/register')
       .send({
         email: 'test@example.com',
         password: 'TestPassword123!'
         // Missing other required fields
       });

     // Assert
     expect(response).to.have.status(400);
     expect(response.body.success).to.be.false;
     expect(response.body.message).to.include('Missing required fields');
     expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
   }); 
  });
});