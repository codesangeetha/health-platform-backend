import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { DoctorModel } from '@/infrastructure/driven-adapters/database';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';
import { validDoctorRegistration } from '@/test/fixtures/doctor-fixtures';

chai.use(chaiHttp);

describe('Get Doctor Profile Integration Tests', () => {

    // Test doctor data
    const testDoctor = {
        ...validDoctorRegistration,
        password: 'TestPassword123!' // Plain password for testing
    };


    let jwtService: JwtService;
    let authToken: string;
    let minimalAuthToken: string;

    beforeEach(async () => {
        // Create JWT service instance
        jwtService = new JwtService(
            process.env.JWT_SECRET || 'default-secret',
            process.env.JWT_EXPIRES_IN || '24h'
        );


        // Generate auth tokens for doctor
        authToken = await jwtService.signToken({
            userId: '68b2a6e3f1a1a37f88875d87',
            email: testDoctor.email,
            userType: testDoctor.userType
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

    describe('GET /api/v1/doctors/profile', () => {



        it('should get doctor profile successfully with complete data', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/doctors/profile')
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Profile retrieved successfully');
            expect(response.body.timestamp).to.be.a('string');


            // Verify profile data structure
            const profileData = response.body.data;

            expect(profileData).to.have.any.keys([
                'firstName', 'lastName', 'email', 'phone',
                'specialization', 'experience', 'consultationFee', 'qualification', 'hospital', 'availableDays', 'availableTime'
            ]);

            // Verify profile data content
            expect(profileData.doctorId).to.be.a('string');
            expect(profileData.firstName).to.equal(testDoctor.firstName);
            expect(profileData.lastName).to.equal(testDoctor.lastName);
            expect(profileData.email).to.equal(testDoctor.email);
            expect(profileData.phone).to.equal(testDoctor.phone);
            expect(profileData.specialization).to.equal(testDoctor.specialization);
            expect(profileData.experience).to.equal(testDoctor.experience);
            expect(profileData.consultationFee).to.deep.equal(testDoctor.consultationFee);
            expect(profileData.qualification).to.deep.equal(testDoctor.qualification);
            expect(profileData.hospital).to.deep.equal(testDoctor.hospital);
            expect(profileData.availableDays).to.deep.equal(testDoctor.availableDays);
            expect(profileData.availableTime).to.deep.equal(testDoctor.availableTime);
        });



        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/doctors/profile');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/doctors/profile')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/doctors/profile')
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
            const user = await DoctorModel.findOne({ email: testDoctor.email });
            expect(user).to.not.be.null;

            // Generate an expired token
            const expiredToken = await shortLivedJwtService.signToken({
                userId: user!._id.toString(),
                email: testDoctor.email,
                userType: 'doctor'
            });

            // Wait for token to expire
            await new Promise(resolve => setTimeout(resolve, 10));

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/doctors/profile')
                .set('Authorization', `Bearer ${expiredToken}`);

            // Assert
            expect(response).to.have.status(401);

        });

    });
});