import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { validPatientRegistration } from '@/test/fixtures/patient-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';

chai.use(chaiHttp);

describe('Update Appointment Status Integration Tests', () => {

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

        // Generate auth token for the patient
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

    describe('PUT /api/v1/appointments/:appointmentId/status', () => {

        it('should update appointment status successfully with complete data', async () => {
            const putData = {
                status: "completed",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const appointmentData = response.body.data;
            expect(appointmentData).to.have.all.keys([
                'appointmentId', 'status', 'reason', 'updatedAt'
            ]);
            expect(appointmentData.status).to.equal('completed');
            expect(appointmentData.reason).to.includes('Patient arrived on time');
        });

        it('should update appointment status successfully without reason', async () => {
            const putData = {
                status: "completed"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const appointmentData = response.body.data;
            expect(appointmentData).to.have.all.keys([
                'appointmentId', 'status', 'reason', 'updatedAt'
            ]);
            expect(appointmentData.status).to.equal('completed');
        });

        it('should return error for missing authorization header', async () => {
            const putData = {
                status: "completed",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .send(putData);

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for invalid authorization header format', async () => {
            const putData = {
                status: "completed",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', 'InvalidFormat')
                .send(putData);

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for invalid JWT token', async () => {
            const putData = {
                status: "completed",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', 'Bearer invalid.token.here')
                .send(putData);

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for missing status field', async () => {
            const putData = {
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Status is required');
        });

        it('should return error for invalid status value', async () => {
            const putData = {
                status: "invalid_status",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid status value');
        });

        it('should return error for non-existent appointment', async () => {
            const putData = {
                status: "completed",
                reason: "Patient arrived on time"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/appointments/507f1f77bcf86cd799439011/status') // Non-existent ID
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(500);
            expect(response.body.success).to.be.false;
        });
    });
});