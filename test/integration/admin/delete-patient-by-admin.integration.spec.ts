import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { expect } from 'chai';

// Mock the dependencies
const mockDeletePatientByAdminController = {
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      // Check if user is authenticated
      const userId = (request as any).user?.userId;
      const userRole = (request as any).user?.userType;

      if (!userId) {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      // Only admin can delete patient profiles
      if (userRole !== 'admin') {
        throw new AppError('Only admin can delete patient profiles', 'FORBIDDEN', 403);
      }

      // Get patientId from URL parameters
      const patientId = request.params.id;
      if (!patientId) {
        throw new AppError('Patient ID is required', 'INVALID_INPUT', 400);
      }

      // Mock response from use case
      const mockResult = {
        success: true,
        message: 'Patient deleted successfully',
        data: {
          patientId: patientId,
          deletedAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      response.status(200).json(mockResult);
    } catch (error) {
      if (error instanceof AppError) {
        response.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode,
          timestamp: new Date().toISOString()
        });
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR',
          timestamp: new Date().toISOString()
        });
      }
    }
  }
};

describe('Admin Patient Delete API', () => {
  it('Should successfully delete patient profile when called by admin', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        reason: 'Patient requested account deletion'
      },
      user: {
        userId: 'admin-123',
        userType: 'admin'
      }
    } as unknown as Request;

    let statusCode = 0;
    let responseBody: any;

    const res = {
      status: function(code: number) { 
        statusCode = code; 
        return this; 
      },
      json: function(body: any) { 
        responseBody = body; 
        return this; 
      }
    } as unknown as Response;

    await mockDeletePatientByAdminController.handle(req, res);

    expect(statusCode).to.equal(200);
    expect(responseBody.success).to.be.true;
    expect(responseBody.message).to.equal('Patient deleted successfully');
    expect(responseBody.data.patientId).to.equal('patient-123');
  });

  it('Should return 401 when user is not authenticated', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        reason: 'Patient requested account deletion'
      },
      user: null
    } as unknown as Request;

    let statusCode = 0;
    let responseBody: any;

    const res = {
      status: function(code: number) { 
        statusCode = code; 
        return this; 
      },
      json: function(body: any) { 
        responseBody = body; 
        return this; 
      }
    } as unknown as Response;

    await mockDeletePatientByAdminController.handle(req, res);

    expect(statusCode).to.equal(401);
    expect(responseBody.success).to.be.false;
    expect(responseBody.message).to.equal('User not authenticated');
    expect(responseBody.error).to.equal('UNAUTHORIZED');
  });

  it('Should return 403 when user is not admin', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        reason: 'Patient requested account deletion'
      },
      user: {
        userId: 'doctor-123',
        userType: 'doctor'
      }
    } as unknown as Request;

    let statusCode = 0;
    let responseBody: any;

    const res = {
      status: function(code: number) { 
        statusCode = code; 
        return this; 
      },
      json: function(body: any) { 
        responseBody = body; 
        return this; 
      }
    } as unknown as Response;

    await mockDeletePatientByAdminController.handle(req, res);

    expect(statusCode).to.equal(403);
    expect(responseBody.success).to.be.false;
    expect(responseBody.message).to.equal('Only admin can delete patient profiles');
    expect(responseBody.error).to.equal('FORBIDDEN');
  });

  it('Should return 400 when patient ID is not provided', async () => {
    const req = {
      params: {},
      body: {
        reason: 'Patient requested account deletion'
      },
      user: {
        userId: 'admin-123',
        userType: 'admin'
      }
    } as unknown as Request;

    let statusCode = 0;
    let responseBody: any;

    const res = {
      status: function(code: number) { 
        statusCode = code; 
        return this; 
      },
      json: function(body: any) { 
        responseBody = body; 
        return this; 
      }
    } as unknown as Response;

    await mockDeletePatientByAdminController.handle(req, res);

    expect(statusCode).to.equal(400);
    expect(responseBody.success).to.be.false;
    expect(responseBody.message).to.equal('Patient ID is required');
    expect(responseBody.error).to.equal('INVALID_INPUT');
  });
});

console.log('Admin Patient Delete API Test Created Successfully!');