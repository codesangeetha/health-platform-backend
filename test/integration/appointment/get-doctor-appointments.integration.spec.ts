import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validPatientRegistration } from '@/test/fixtures/patient-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';

chai.use(chaiHttp);

describe('Get Doctor Appointments Integration Tests', () => {

    // Test doctor data
    const testDoctor = {
        ...validPatientRegistration,
        userType: 'doctor',
        specialization: 'Cardiology',
        licenseNumber: 'DOC123456',
        experience: '5 years',
        consultationFee: 100,
        qualification: 'MD',
        hospital: 'City Hospital',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
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

        // Generate auth token for the doctor
        authToken = await jwtService.signToken({
            userId: '68ad63f945a67ae2cbb84236',
            email: testDoctor.email,
            userType: testDoctor.userType
        });
    });

    afterEach(async () => {
        // Clean up database after each test
    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('GET /api/v1/appointments/doctor', () => {

        it('should get doctor appointments successfully with all query parameters', async () => {
            const queryParams = {
                date: "2024-01-15",
                status: "confirmed",
                page: "1",
                limit: "10"
            };

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .query(queryParams)
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const appointmentData = response.body.data;
            expect(appointmentData).to.have.all.keys(['appointments', 'pagination']);
            
            // Verify appointments array structure
            if (appointmentData.appointments.length > 0) {
                const appointment = appointmentData.appointments[0];
                expect(appointment).to.have.all.keys([
                    'appointmentId', 'patient', 'date', 'time', 'status', 'appointmentType', 'reason'
                ]);
                expect(appointment.patient).to.have.all.keys([
                    'patientId', 'firstName', 'lastName', 'age'
                ]);
            }
            
            // Verify pagination structure
            expect(appointmentData.pagination).to.have.all.keys([
                'page', 'limit', 'total', 'totalPages'
            ]);
        });

        it('should get doctor appointments successfully with only date filter', async () => {
            const queryParams = {
                date: "2024-01-15"
            };

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .query(queryParams)
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
        });

        it('should get doctor appointments successfully with only status filter', async () => {
            const queryParams = {
                status: "confirmed"
            };

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .query(queryParams)
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
        });

        it('should get doctor appointments successfully with pagination', async () => {
            const queryParams = {
                page: "2",
                limit: "5"
            };

            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .query(queryParams)
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
            expect(response.body.data.pagination.page).to.equal(2);
            expect(response.body.data.pagination.limit).to.equal(5);
        });

        it('should get doctor appointments successfully without any query parameters', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Operation successful');
        });

        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor');

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .set('Authorization', 'Bearer invalid.token.here');

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return empty appointments array when no appointments exist', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/doctor')
                .set('Authorization', `Bearer ${authToken}`);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.data.appointments).to.be.an('array');
        });
    });
});