import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { DoctorModel } from '@/infrastructure/driven-adapters/database';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';
import { validDoctorRegistration ,bodyData} from '@/test/fixtures/doctor-fixtures';


chai.use(chaiHttp);

describe('Get Doctor Profile Integration Tests', () => {

    // Test doctor data
    const testPatient = {
        ...validDoctorRegistration,
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
            userId: '68b2a6e3f1a1a37f88875d87',
            email: testPatient.email,
            userType: testPatient.userType
        });


    });

    afterEach(async () => {
        // Clean up database after each test

    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('PUT /api/v1/doctors/profile', () => {



        it('should get doctors profile successfully with complete data', async () => {
            const response = await (chai as any).request(app)
                .put('/api/v1/doctors/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send(bodyData);


            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Profile updated successfully');
            expect(response.body.timestamp).to.be.a('string');


            // Verify profile data structure
            const profileData = response.body.data;
            console.log("profileData", profileData);
            expect(profileData).to.have.all.keys([
                'doctorId', 'firstName', 'lastName', 'phone', 'email'
            ]);

        });



        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/doctors/profile');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/doctors/profile')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/doctors/profile')
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
            const user = await DoctorModel.findOne({ email: testPatient.email });
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
                .put('/api/v1/doctors/profile')
                .set('Authorization', `Bearer ${expiredToken}`);

            // Assert
            expect(response).to.have.status(401);

        });

    });
});