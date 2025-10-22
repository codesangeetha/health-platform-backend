import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validUserRegistration } from '@/test/fixtures/user-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import bcrypt from 'bcrypt';

chai.use(chaiHttp);

describe('Reset Password Integration Tests', () => {
    // Test user data
    const testUser = {
        ...validUserRegistration,
        password: 'TestPassword123!' // Plain password for testing
    };

    let jwtService: JwtService;
    let resetToken: string;

    beforeEach(async () => {
        // Create a test user before each test
        const hashedPassword = await bcrypt.hash(testUser.password, 10);
        await PatientModel.create({
            ...testUser,
            password: hashedPassword
        });

        // Create JWT service instance
        jwtService = new JwtService(
            process.env.JWT_SECRET || 'test-secret-key',
            '1h' // 1 hour expiration
        );

        // Generate a reset token
        resetToken = await jwtService.signToken({
            userId: 'user123', // This would normally come from the created user
            email: testUser.email,
            purpose: 'password_reset'
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

    describe('POST /api/v1/auth/reset-password', () => {

        it('should reset password successfully with valid token', async () => {
            // Arrange - get the created user to get their actual ID
            const user = await PatientModel.findOne({ email: testUser.email });
            expect(user).to.not.be.null;

            // Generate a new token with the actual user ID
            const resetTokenPayload = {
                userId: (user as any)._id,
                email: (user as any).email,
                purpose: 'password_reset'
            };

            const jwtService = new JwtService(
                process.env.JWT_SECRET || 'default-secret',
                process.env.JWT_EXPIRES_IN || '24h'
            );
            const resetToken = await jwtService.signToken(resetTokenPayload);

            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });
            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Password has been reset successfully');
            expect(response.body.timestamp).to.be.a('string');

            // Verify password was actually changed
            const updatedUser = await PatientModel.findOne({ email: testUser.email });
            expect(updatedUser).to.not.be.null;

            // Check that the new password works (by comparing hashes)
            const isNewPasswordValid = await bcrypt.compare('NewPassword123!', (updatedUser as any).password);
            expect(isNewPasswordValid).to.be.true;

            // Check that the old password doesn't work
            const isOldPasswordValid = await bcrypt.compare(testUser.password, (updatedUser as any).password);
            expect(isOldPasswordValid).to.be.false;
        });

        it('should return error for invalid token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: 'invalid-token',
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });

            // Assert
            expect(response).to.have.status(401);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid or expired reset token');
            expect(response.body.error).to.equal('INVALID_TOKEN');
            expect(response.body.timestamp).to.be.a('string');
        });

        it('should return error for expired token', async () => {
            // Arrange - create a JWT service with very short expiration
            const shortLivedJwtService = new JwtService(
                process.env.JWT_SECRET || 'test-secret-key',
                '1ms' // 1 millisecond expiration
            );

            // Get the created user
            const user = await PatientModel.findOne({ email: testUser.email });
            expect(user).to.not.be.null;

            // Generate an expired token
            const expiredToken = await shortLivedJwtService.signToken({
                userId: user!._id.toString(),
                email: testUser.email,
                purpose: 'password_reset'
            });

            // Wait for token to expire
            await new Promise(resolve => setTimeout(resolve, 10));

            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: expiredToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });

            // Assert
            expect(response).to.have.status(401);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid or expired reset token');
            expect(response.body.error).to.equal('INVALID_TOKEN');
        });

        it('should return error for token with wrong purpose', async () => {
            // Arrange - get the created user
            const user = await PatientModel.findOne({ email: testUser.email });
            expect(user).to.not.be.null;

            // Generate a token with wrong purpose
            const wrongPurposeToken = await jwtService.signToken({
                userId: user!._id.toString(),
                email: testUser.email,
                purpose: 'wrong_purpose'
            });

            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: wrongPurposeToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });

            // Assert
            expect(response).to.have.status(401);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid or expired reset token');
            expect(response.body.error).to.equal('INVALID_TOKEN');
        });

        it('should return error for non-existent user ID in token', async () => {

            const jwtService = new JwtService(
                process.env.JWT_SECRET || 'default-secret',
                process.env.JWT_EXPIRES_IN || '24h'
            );
            // Arrange - generate a token with non-existent user ID
            const nonExistentUserToken = await jwtService.signToken({
                userId: '507f1f77bcf86cd799439011', // Valid ObjectId but doesn't exist in DB
                email: testUser.email,
                purpose: 'password_reset'
            });

            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: nonExistentUserToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });


            // Assert
            expect(response).to.have.status(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('User not found');
            expect(response.body.error).to.equal('USER_NOT_FOUND');
        });

        it('should return error for missing token', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Missing required fields: token');
            expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
        });

        it('should return error for missing new password', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: '',
                    confirmPassword: 'NewPassword123!'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Missing required fields: newPassword');
            expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
        });

        it('should return error for missing confirm password', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: ''
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Missing required fields: confirmPassword');
            expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
        });

        it('should return error for password mismatch', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'DifferentPassword123!'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('New password and confirm password do not match');
            expect(response.body.error).to.equal('PASSWORD_MISMATCH');
        });

        it('should return error for weak password', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'weak',
                    confirmPassword: 'weak'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            expect(response.body.error).to.equal('INVALID_PASSWORD');
        });

        it('should return error for empty request body', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({});

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Request body is empty');
            expect(response.body.error).to.equal('EMPTY_REQUEST_BODY');
        });

        it('should ignore extra fields in request body', async () => {
            // Arrange - get the created user
            const user = await PatientModel.findOne({ email: testUser.email });
            expect(user).to.not.be.null;

            const jwtService = new JwtService(
                process.env.JWT_SECRET || 'default-secret',
                process.env.JWT_EXPIRES_IN || '24h'
            );

            // Generate a valid token
            const validResetToken = await jwtService.signToken({
                userId: user!._id.toString(),
                email: testUser.email,
                purpose: 'password_reset'
            });

            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/reset-password')
                .send({
                    token: validResetToken,
                    newPassword: 'NewPassword123!',
                    confirmPassword: 'NewPassword123!',
                    extraField: 'should be ignored'
                });

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            // The extra field should be ignored and request should succeed
        });


    });
});