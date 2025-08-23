import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import  app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validUserRegistration, validLoginRequest, invalidLoginRequest } from '@/test/fixtures/user-fixtures';
import bcrypt from 'bcrypt';

chai.use(chaiHttp);

describe('Login User Integration Tests', () => {
  // Test user data
  const testUser = {
    ...validUserRegistration,
    password: 'TestPassword123!' // Plain password for testing
  };

  beforeEach(async () => {
    // Create a test user before each test
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await PatientModel.create({
      ...testUser,
      password: hashedPassword
    });
  });

  afterEach(async () => {
    // Clean up database after each test
    await PatientModel.deleteMany({});
  });

  after(async () => {
    // Close database connection after all tests
    await mongoose.connection.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send(validLoginRequest);

      // Assert
      expect(response).to.have.status(200);
      expect(response.body.success).to.be.true;
      expect(response.body.message).to.equal('Login successful');
      expect(response.body.data.token).to.be.a('string');
      expect(response.body.data.user.userId).to.be.a('string');
      expect(response.body.data.user.email).to.equal(validLoginRequest.email);
      expect(response.body.data.user.userType).to.equal('patient');
      expect(response.body.timestamp).to.be.a('string');
    });

    it('should return error for invalid password', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!'
        });

      // Assert
      expect(response).to.have.status(401);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal('Invalid email or password');
      expect(response.body.error).to.equal('INVALID_CREDENTIALS');
    });

    it('should return error for non-existent user', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!'
        });

      // Assert
      expect(response).to.have.status(401);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal('Invalid email or password');
      expect(response.body.error).to.equal('INVALID_CREDENTIALS');
    });

    it('should return error for missing email', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          password: 'TestPassword123!'
        });

      // Assert
      expect(response).to.have.status(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.include('Missing required fields');
      expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
    });

    it('should return error for missing password', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email
        });

      // Assert
      expect(response).to.have.status(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.include('Missing required fields');
      expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
    });

    it('should return error for invalid email format', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!'
        });

      // Assert
      expect(response).to.have.status(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal('Invalid email format');
      expect(response.body.error).to.equal('INVALID_EMAIL');
    });

    it('should return error for empty request body', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({});

      // Assert
      expect(response).to.have.status(400);
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.equal('Request body is empty');
      expect(response.body.error).to.equal('EMPTY_REQUEST_BODY');
    });

    it('should return error for extra fields in request body', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send({
          ...validLoginRequest,
          extraField: 'should be ignored'
        });

      // Assert
      expect(response).to.have.status(200);
      expect(response.body.success).to.be.true;
      // The extra field should be ignored and login should succeed
    });

    it('should handle concurrent login requests', async () => {
      // Act - make multiple concurrent login requests
      const requests = [
        (chai as any).request(app).post('/api/v1/auth/login').send(validLoginRequest),
        (chai as any).request(app).post('/api/v1/auth/login').send(validLoginRequest),
        (chai as any).request(app).post('/api/v1/auth/login').send(validLoginRequest)
      ];

      const responses = await Promise.all(requests);

      // Assert
      responses.forEach(response => {
        expect(response).to.have.status(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.token).to.be.a('string');
      });
    });

    it('should return consistent error format', async () => {
      // Act
      const response = await (chai as any).request(app)
        .post('/api/v1/auth/login')
        .send(invalidLoginRequest);

      // Assert
      expect(response).to.have.status(401);
      expect(response.body).to.have.all.keys('success', 'message', 'error', 'timestamp');
      expect(response.body.success).to.be.false;
      expect(response.body.message).to.be.a('string');
      expect(response.body.error).to.be.a('string');
      expect(response.body.timestamp).to.be.a('string');
    });
  });
});