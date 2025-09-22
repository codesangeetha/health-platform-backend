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

describe('Get Patient Appointments Integration Tests', () => {

    // Test patient data
    const testPatient = {
        ...validPatientRegistration,
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

    describe('GET /api/v1/appointments/patient', () => {



        it('should get patient appointments successfully with complete data', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/patient')
                .set('Authorization', `Bearer ${authToken}`);

            console.log("response", response.body);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Appointments retrieved successfully');
            expect(response.body.timestamp).to.be.a('string');


            // Verify profile data structure
            const data = response.body.data;

            expect(data).to.have.all.keys([
                "appointments", "pagination"
            ]);

        });



        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/patient');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/patient')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .get('/api/v1/appointments/patient')
                .set('Authorization', 'Bearer invalid.token.here');

            // Assert
            expect(response).to.have.status(401);

        });

    });
});