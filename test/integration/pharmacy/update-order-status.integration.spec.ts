import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import app from '@/infrastructure/entry-points/api';
import { validPatientRegistration } from '@/test/fixtures/patient-fixtures';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';

chai.use(chaiHttp);

describe('Update Pharmacy Order Status Integration Tests', () => {

    // Test patient data
    const testPatient = {
        ...validPatientRegistration,
        password: 'TestPassword123!', // Plain password for testing
        userType: 'admin' // Admin role for testing order status updates
    };

    let jwtService: JwtService;
    let authToken: string;

    beforeEach(async () => {
        // Create JWT service instance
        jwtService = new JwtService(
            process.env.JWT_SECRET || 'default-secret',
            process.env.JWT_EXPIRES_IN || '24h'
        );

        // Generate auth token for the admin user
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

    describe('PUT /api/v1/pharmacy/orders/:orderId/status', () => {

        it('should update pharmacy order status to "completed" successfully with complete data', async () => {
            const putData = {
                status: "completed",
                reason: "Order completed successfully"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Order status updated successfully');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const orderData = response.body.data;
            expect(orderData).to.have.all.keys([
                'orderId', 'status', 'reason', 'updatedAt'
            ]);
            expect(orderData.status).to.equal('completed');
            expect(orderData.reason).to.includes('Order completed successfully');
        });

        it('should update pharmacy order status to "pending" successfully', async () => {
            const putData = {
                status: "pending",
                reason: "Order set back to pending"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Order status updated successfully');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const orderData = response.body.data;
            expect(orderData).to.have.all.keys([
                'orderId', 'status', 'reason', 'updatedAt'
            ]);
            expect(orderData.status).to.equal('pending');
        });

        it('should update pharmacy order status to "cancelled" successfully', async () => {
            const putData = {
                status: "cancelled",
                reason: "Order cancelled due to customer request"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Order status updated successfully');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const orderData = response.body.data;
            expect(orderData).to.have.all.keys([
                'orderId', 'status', 'reason', 'updatedAt'
            ]);
            expect(orderData.status).to.equal('cancelled');
        });

        it('should update pharmacy order status successfully without reason', async () => {
            const putData = {
                status: "completed"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(200);
            expect(response.body.success).to.be.true;
            expect(response.body.message).to.equal('Order status updated successfully');
            expect(response.body.timestamp).to.be.a('string');

            // Verify response data structure
            const orderData = response.body.data;
            expect(orderData).to.have.all.keys([
                'orderId', 'status', 'reason', 'updatedAt'
            ]);
            expect(orderData.status).to.equal('completed');
        });

        it('should return error for missing authorization header', async () => {
            const putData = {
                status: "completed",
                reason: "Order completed successfully"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .send(putData);

            // Assert
            expect(response).to.have.status(401);
        });

        it('should return error for missing status field', async () => {
            const putData = {
                reason: "Missing status field test"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Status is required');
        });

        it('should return error for invalid status value', async () => {
            const putData = {
                status: "confirmed", // This is no longer a valid status
                reason: "Invalid status test"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/68cfcb8e5ffb0bf425a65cbc/status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Invalid status value');
        });

        it('should return error for non-existent order', async () => {
            const putData = {
                status: "completed",
                reason: "Non-existent order test"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders/507f1f77bcf86cd799439011/status') // Non-existent ID
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(404);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Order not found');
        });

        it('should return error for missing order ID parameter', async () => {
            const putData = {
                status: "completed",
                reason: "Missing order ID test"
            };

            // Act
            const response = await (chai as any).request(app)
                .put('/api/v1/pharmacy/orders//status')
                .set('Authorization', `Bearer ${authToken}`)
                .send(putData);

            // Assert
            expect(response).to.have.status(400);
            expect(response.body.success).to.be.false;
            expect(response.body.message).to.equal('Order ID is required');
        });
    });
});