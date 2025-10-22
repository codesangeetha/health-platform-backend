import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';
import { DoctorModel } from '@/infrastructure/driven-adapters/database';

chai.use(chaiHttp);

describe('Update user Integration Tests', () => {

    //const email = 'test@example.com';

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

    });

    afterEach(async () => {
        // Clean up database after each test

    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('PUT /api/v1/admin/users', () => {

        it('should update user status successfully ', async () => {
            // Act
            const usersData = {
                "isVerified": false
            }



            const response = await (chai as any).request(app)
                .put('/api/v1/admin/users/68b2a6e3f1a1a37f88875d87/status')
                .send(usersData)
                .set('Authorization', `Bearer ${authToken}`);
            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('isVerified updated successfully');
            expect(response.body.data.userId).to.be.a('string');
            expect(response.body.data.isVerified).to.be.false;
            expect(response.body.timestamp).to.be.a("string");
        });

        it('should return error for missing authorization header', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/admin/users/68b2a6e3f1a1a37f88875d87/status');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid authorization header format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/admin/users/68b2a6e3f1a1a37f88875d87/status')
                .set('Authorization', 'InvalidFormat');

            // Assert
            expect(response).to.have.status(401);

        });

        it('should return error for invalid JWT token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/admin/users/68b2a6e3f1a1a37f88875d87/status')
                .set('Authorization', 'Bearer invalid.token.here');

            // Assert
            expect(response).to.have.status(401);

        });

    });
});