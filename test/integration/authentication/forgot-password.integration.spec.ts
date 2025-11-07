import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { validUserRegistration } from '@/test/fixtures/user-fixtures';
import sinon from 'sinon';
import { hashPassword } from '@/shared/utils/helpers';

chai.use(chaiHttp);

describe('Forgot Password Integration Tests', () => {
    // Test user data
    const testUser = {
        ...validUserRegistration,
        password: 'TestPassword123!' // Plain password for testing
    };

    let emailServiceStub: any;

    beforeEach(async () => {
        // Create a test user before each test
        const hashedPassword = await hashPassword(testUser.password);
        await PatientModel.create({
            ...testUser,
            password: hashedPassword
        });

        // Stub the email service to prevent actual email sending
        emailServiceStub = sinon.stub().resolves();

        // Replace the email service in the app with our stub
        // This requires accessing the email service instance in your app
        // The exact implementation depends on how you've structured your app
        // This is a simplified example - adjust according to your actual structure
        const { MailtrapEmailService } = require('@/infrastructure/driven-adapters/email/mailtrap-email.service');
        sinon.stub(MailtrapEmailService.prototype, 'sendEmail').callsFake(emailServiceStub);
    });

    afterEach(async () => {
        // Clean up database after each test
        await PatientModel.deleteMany({});

        // Restore all stubs
        sinon.restore();
    });

    after(async () => {
        // Close database connection after all tests
        await mongoose.connection.close();
    });

    describe('POST /api/v1/auth/forgot-password', () => {
        it('should return success message for existing email', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: testUser.email
                });

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Please check your mailbox you will receive a link shortly.');
            expect(response.body.timestamp).to.be.a('string');

            // Verify email service was called
            expect(emailServiceStub.calledOnce).to.be.true;
        });

        it('should return error message for non-existing email (unregistered user)', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: 'nonexistent@example.com'
                });

            // Assert
            expect(response).to.have.status(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('User is not registered with this email address');
            expect(response.body.error).to.equal('USER_NOT_FOUND');
            expect(response.body.timestamp).to.be.a('string');

            // Verify email service was NOT called
            expect(emailServiceStub.called).to.be.false;
        });

        it('should return error for missing email', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: ''
                });
            console.log("response.body", response.body);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Missing required fields: email');
            expect(response.body.error).to.equal('MISSING_REQUIRED_FIELDS');
            expect(response.body.timestamp).to.be.a('string');
        });

        it('should return error for invalid email format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: 'invalid-email'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid email format');
            expect(response.body.error).to.equal('INVALID_EMAIL');
            expect(response.body.timestamp).to.be.a('string');
        });

        it('should return error for empty request body', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({});

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Request body is empty');
            expect(response.body.error).to.equal('EMPTY_REQUEST_BODY');
            expect(response.body.timestamp).to.be.a('string');
        });

        it('should ignore extra fields in request body', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: testUser.email,
                    extraField: 'should be ignored'
                });

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            // The extra field should be ignored and request should succeed
        });

        it('should handle concurrent forgot-password requests', async () => {
            // Act - make multiple concurrent forgot-password requests
            const requests = [
                (chai as any).request(app).post('/api/v1/auth/forgot-password').send({ email: testUser.email }),
                (chai as any).request(app).post('/api/v1/auth/forgot-password').send({ email: testUser.email }),
                (chai as any).request(app).post('/api/v1/auth/forgot-password').send({ email: testUser.email })
            ];

            const responses = await Promise.all(requests);

            // Assert
            responses.forEach(response => {
                expect(response).to.have.status(200);
                expect(response.body.success).to.be.true;
            });

            // Verify email service was called for each request
            expect(emailServiceStub.callCount).to.equal(3);
        });

        it('should return consistent error format', async () => {
            // Act
            const response = await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: 'invalid-email'
                });

            // Assert
            expect(response).to.have.status(400);
            expect(response.body).to.have.all.keys('success', 'message', 'error', 'timestamp');
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.be.a('string');
            expect(response.body.error).to.be.a('string');
            expect(response.body.timestamp).to.be.a('string');
        });


        it('should send email with correct parameters', async () => {
            // Act
            await (chai as any).request(app)
                .post('/api/v1/auth/forgot-password')
                .send({
                    email: testUser.email
                });

            // Assert
            expect(emailServiceStub.calledOnce).to.be.true;

            const callArgs = emailServiceStub.firstCall.args;
            expect(callArgs[0]).to.equal(testUser.email); // toEmail
            expect(callArgs[1]).to.be.a('string'); // subject
            expect(callArgs[1]).to.include('Password Reset'); // subject contains "Password Reset"
            expect(callArgs[2]).to.be.a('string'); // message
            expect(callArgs[2]).to.include('reset'); // message contains reset link
        });
    });
});