import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validPatientRegistration, } from '@/test/fixtures/patient-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';

chai.use(chaiHttp);

describe('Get Available Doctors Integration Tests', () => {

    // Test patient data
    const testPatient = {
        ...validPatientRegistration,
        password: 'TestPassword123!' // Plain password for testing
    };

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
            userId: '68ad63f945a67ae2cbb84235',
            email: testPatient.email,
            userType: testPatient.userType
        });

        /*   minimalAuthToken = await jwtService.signToken({
             userId: (patient as any)._id,
             email: minimalPatient.email,
             userType: 'patient'
         });  */
    });

    afterEach(async () => {
        // Clean up database after each test

    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('GET /api/v1/appointments/doctors', () => {



         it('should get available doctors successfully with complete data', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctors?limit=5&page=1&specialization=Cardiologist')
                .set('Authorization', `Bearer ${authToken}`);

console.log("response",response.body);
            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Doctors retrieved successfully');
            expect(response.body.timestamp).to.be.a('string');


            // Verify profile data structure
            const data = response.body.data;

            expect(data).to.have.all.keys([
                "doctors","pagination"
            ]);

            
        });



       it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctors?limit=5&page=1&specialization=Cardiologist');

            // Assert
            expect(response).to.have.status(401);

        });

         it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctors?limit=5&page=1&specialization=Cardiologist')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

       it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctors?limit=5&page=1&specialization=Cardiologist')
                .set('Authorization', 'Bearer invalid.token.here');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for expired JWT token', async () => {
            // Arrange - create a JWT service with very short expiration
            const shortLivedJwtService = new JwtService(
                process.env.JWT_SECRET || 'test-secret-key',
                '1ms' // 1 millisecond expiration
            );

            // Get the created user
            const user = await PatientModel.findOne({ email: testPatient.email });
            expect(user).to.not.be.null;

            // Generate an expired token
            const expiredToken = await shortLivedJwtService.signToken({
                userId: user!._id.toString(),
                email: testPatient.email,
                userType: 'patient'
            });

            // Wait for token to expire
            await new Promise(resolve => setTimeout(resolve, 10));

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctors?limit=5&page=1&specialization=Cardiologist')
                .set('Authorization', `Bearer ${expiredToken}`);

            // Assert
            expect(response).to.have.status(401);

        });

    });
});