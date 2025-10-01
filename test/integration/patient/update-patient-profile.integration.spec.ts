import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validPatientRegistration, updateData } from '@/test/fixtures/patient-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';

chai.use(chaiHttp);

describe('Get Patient Profile Integration Tests', () => {

    // Test patient data
    const testPatient = {
        ...validPatientRegistration,
        whatsapp: '+1234567892',
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


    });

    afterEach(async () => {
        // Clean up database after each test

    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('PUT /api/v1/patients/profile', () => {



        it('should get patient profile successfully with complete data', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);


            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Profile updated successfully');
            expect(response.body.timestamp).to.be.a('string');


            // Verify profile data structure
            const profileData = response.body.data;

            expect(profileData).to.have.all.keys([
                'patientId', 'firstName', 'lastName', 'email', 'phone', 'whatsapp'
            ]);

        });



        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
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
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${expiredToken}`);

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for duplicate phone number', async () => {
            // Arrange - Create another patient with a different phone number first
            const anotherPatient = {
                ...validPatientRegistration,
                email: 'anotherpatient@test.com',
                phone: '9876543210',
                whatsapp: '9876543211'
            };

            // Create the second patient in database
            const hashedPassword = await bcrypt.hash(anotherPatient.password, 10);
            await PatientModel.create({
                ...anotherPatient,
                password: hashedPassword
            });

            // Generate token for the second patient
            const anotherToken = await jwtService.signToken({
                userId: '68ad63f945a67ae2cbb84236',
                email: anotherPatient.email,
                userType: 'patient'
            });

            // Try to update the second patient with the same phone number as the first patient
            const updateDataWithDuplicatePhone = {
                ...updateData,
                phone: '+1234567890' // Use the same phone as the first patient
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${anotherToken}`)
                .send(updateDataWithDuplicatePhone);

            // Assert
            expect(response).to.have.status(409);
            expect(response.body.success).to.be.false;
            expect(response.body.error).to.equal('PHONE_ALREADY_EXISTS');
            expect(response.body.message).to.equal('Phone number is already registered to another user');
        });

        it('should return error for duplicate whatsapp number', async () => {
            // Arrange - Create another patient with a different whatsapp number first
            const anotherPatient = {
                ...validPatientRegistration,
                email: 'anotherpatient2@test.com',
                phone: '9876543212',
                whatsapp: '9876543213'
            };

            // Create the second patient in database
            const hashedPassword = await bcrypt.hash(anotherPatient.password, 10);
            await PatientModel.create({
                ...anotherPatient,
                password: hashedPassword
            });

            // Generate token for the second patient
            const anotherToken = await jwtService.signToken({
                userId: '68ad63f945a67ae2cbb84237',
                email: anotherPatient.email,
                userType: 'patient'
            });

            // Try to update the second patient with the same whatsapp number as the first patient
            const updateDataWithDuplicateWhatsapp = {
                ...updateData,
                whatsapp: '+1234567892' // Use the same whatsapp as the first patient
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${anotherToken}`)
                .send(updateDataWithDuplicateWhatsapp);

            // Assert
            expect(response).to.have.status(409);
            expect(response.body.success).to.be.false;
            expect(response.body.error).to.equal('WHATSAPP_ALREADY_EXISTS');
            expect(response.body.message).to.equal('WhatsApp number is already registered to another user');
        });

        it('should return error for duplicate email', async () => {
            // Arrange - Create another patient with a different email first
            const anotherPatient = {
                ...validPatientRegistration,
                email: 'anotherpatient3@test.com',
                phone: '9876543214',
                whatsapp: '9876543215'
            };

            // Create the second patient in database
            const hashedPassword = await bcrypt.hash(anotherPatient.password, 10);
            await PatientModel.create({
                ...anotherPatient,
                password: hashedPassword
            });

            // Generate token for the second patient
            const anotherToken = await jwtService.signToken({
                userId: '68ad63f945a67ae2cbb84238',
                email: anotherPatient.email,
                userType: 'patient'
            });

            // Try to update the second patient with the same email as the first patient
            const updateDataWithDuplicateEmail = {
                ...updateData,
                email: testPatient.email // Use the same email as the first patient
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${anotherToken}`)
                .send(updateDataWithDuplicateEmail);

            // Assert
            expect(response).to.have.status(409);
            expect(response.body.success).to.be.false;
            expect(response.body.error).to.equal('EMAIL_ALREADY_EXISTS');
            expect(response.body.message).to.equal('Email is already registered to another user');
        });

        it('should allow updating patient with same phone and whatsapp numbers (own profile)', async () => {
            // Act - Update the same patient with their own phone and whatsapp numbers
            const response = await (chai as any).request(app)
                .put('/api/v1/patients/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Profile updated successfully');
        });

    });
});