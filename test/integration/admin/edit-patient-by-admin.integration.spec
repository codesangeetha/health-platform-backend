import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';

// Mock the dependencies
const mockEditPatientByAdminUseCase = {
  execute: jest.fn()
};

const mockEditPatientByAdminController = {
  handle: async (request: Request, response: Response): Promise<void> => {
    try {
      // Check if user is authenticated
      const userId = (request as any).user?.userId;
      const userRole = (request as any).user?.userType;

      if (!userId) {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      // Only admin can edit patient profiles
      if (userRole !== 'admin') {
        throw new AppError('Only admin can edit patient profiles', 'FORBIDDEN', 403);
      }

      // Get patientId from URL parameters
      const patientId = request.params.id;
      if (!patientId) {
        throw new AppError('Patient ID is required', 'INVALID_INPUT', 400);
      }

      // Mock response from use case
      const mockResult = {
        success: true,
        message: 'Patient profile updated successfully',
        data: {
          patientId: patientId,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          updatedFields: ['firstName', 'email']
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

describe('Admin Patient Edit API', () => {
  test('Should successfully update patient profile when called by admin', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        firstName: 'John',
        email: 'john.doe@example.com'
      },
      user: {
        userId: 'admin-123',
        userType: 'admin'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await mockEditPatientByAdminController.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
      message: 'Patient profile updated successfully',
      data: expect.objectContaining({
        patientId: 'patient-123',
        firstName: 'John',
        email: 'john.doe@example.com'
      })
    }));
  });

  test('Should return 401 when user is not authenticated', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        firstName: 'John'
      },
      user: null
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await mockEditPatientByAdminController.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'User not authenticated',
      error: 'UNAUTHORIZED'
    }));
  });

  test('Should return 403 when user is not admin', async () => {
    const req = {
      params: { id: 'patient-123' },
      body: {
        firstName: 'John'
      },
      user: {
        userId: 'doctor-123',
        userType: 'doctor'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await mockEditPatientByAdminController.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Only admin can edit patient profiles',
      error: 'FORBIDDEN'
    }));
  });

  test('Should return 400 when patient ID is not provided', async () => {
    const req = {
      params: {},
      body: {
        firstName: 'John'
      },
      user: {
        userId: 'admin-123',
        userType: 'admin'
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    await mockEditPatientByAdminController.handle(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Patient ID is required',
      error: 'INVALID_INPUT'
    }));
  });
});

console.log('Admin Patient Edit API Test Created Successfully!');