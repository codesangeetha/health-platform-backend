import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';
import { DoctorModel } from '@/infrastructure/driven-adapters/database';

chai.use(chaiHttp);

describe('Create user Integration Tests', () => {

    const email = 'test@example.com';

    let jwtService: JwtService;
    let authToken: string;

    beforeEach(async () => {
        // Create JWT service instance
        jwtService = new JwtService(
            process.env.JWT_SECRET || 'default-secret',
            process.env.JWT_EXPIRES_IN || '24h'
        );


        // Generate auth tokens for both patients
        authToken = await jwtService.signToken({
            userId: 'adminid',
            email: "admin@mail.com",
            userType: "admin"
        });


        await DoctorModel.deleteOne({ email: email });


    });

    afterEach(async () => {
        // Clean up database after each test

    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('POST /api/v1/admin/users', () => {

        it('should create user successfully with complete data', async () => {
            // Act

            const usersData = {
                "userType": "doctor",
                "email": email,
                "password": "vimala123pwd",
                "firstName": "Vimala",
                "lastName": "Johnson",
                "phone": "+1234567890",
                "dateOfBirth": "1993-05-20",
                "specialization": "Neurology",
                "qualification": "MBBS,MD",
                "hospital": "General hospital",
                "licenseNumber": "MD7890122",
                "experience": "20",
                "consultationFee": 300
            }

            const response = await (chai as any).request(app)
                .post('/api/v1/admin/users')
                .send(usersData)
                .set('Authorization', `Bearer ${authToken}`);
            // Assert

            expect(response).to.have.status(201);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('User created successfully');
            expect(response.body.data.userId).to.be.a('string');
            expect(response.body.data.email).to.equal(email);
            expect(response.body.data.userType).to.equal("doctor");
        });

        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/admin/users');

            // Assert
            expect(response).to.have.status(401);

        });

       it('should return error for invalid authorization header format', async () => {
              // Act
              const response = await (chai as any).request(app)
                  .post('/api/v1/admin/users')
                  .set('Authorization', 'InvalidFormat');
  
              // Assert
              expect(response).to.have.status(401);
  
          });
  
         it('should return error for invalid JWT token', async () => {
              // Act
              const response = await (chai as any).request(app)
                  .post('/api/v1/admin/users')
                  .set('Authorization', 'Bearer invalid.token.here');
  
              // Assert
              expect(response).to.have.status(401);
  
          });

    });
});