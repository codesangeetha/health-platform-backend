import { Request, Response } from 'express';
import { ISpecializationController } from '../interfaces/admin/specialization.controller.interface';
import { ISpecializationUseCase } from '../../../domain/use-cases/interfaces/admin/specialization.use-case.interface';
import { AppError } from '@/shared/errors/app-error';
import { 
  CreateSpecializationRequest, 
  UpdateSpecializationRequest 
} from '@/domain/types/admin/specialization.type';

export class SpecializationController implements ISpecializationController {
  constructor(
    private readonly specializationUseCase: ISpecializationUseCase
  ) { }

  async handleCreate(req: Request, res: Response): Promise<void> {
    try {
      const tokenUserType = (req as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const { name } = req.body;

      if (!name || name.trim().length === 0) {
        throw new AppError('Specialization name is required', 'SPECIALIZATION_001', 400);
      }

      const request: CreateSpecializationRequest = { name: name.trim() };

      const result = await this.specializationUseCase.create(request);

      res.status(201).json(result);

    } catch (error) {

      if (error instanceof AppError) {
        console.log('AppError caught:', {
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode
        });

        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode
        });
      } else {

        console.log('Non-AppError caught, sending generic 500 response');

        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }

      console.log('=== CREATE SPECIALIZATION ERROR END ===');
    }
  }

  async handleGetAll(req: Request, res: Response): Promise<void> {
    try {
      const tokenUserType = (req as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      // Extract pagination parameters from query string
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Extract search parameters from query string
      const name = req.query.name as string;
      const fromDate = (req.query.fromDate as string) || (req.query.from as string);
      const toDate = (req.query.toDate as string) || (req.query.to as string);

      // Validate pagination parameters
      if (page < 1) {
        throw new AppError('Page must be greater than 0', 'INVALID_PAGINATION', 400);
      }
      
      if (limit < 1 || limit > 100) {
        throw new AppError('Limit must be between 1 and 100', 'INVALID_PAGINATION', 400);
      }

      // Build search filters
      const searchFilters: any = {};
      
      if (name && name.trim()) {
        searchFilters.name = { 
          $regex: name.trim(), 
          $options: 'i'  // case-insensitive search
        };
      }

      // Handle date filtering
      if (fromDate || toDate) {
        const dateFilter: any = {};
        
        if (fromDate) {
          const from = this.parseDate(fromDate, 'from');
          if (from) dateFilter.gte = from;
        }
        
        if (toDate) {
          const to = this.parseDate(toDate, 'to');
          if (to) dateFilter.lte = to;
        }
        
        if (Object.keys(dateFilter).length > 0) {
          searchFilters.createdAt = dateFilter;
        }
      }

      const result = await this.specializationUseCase.getAll(page, limit, searchFilters);

      res.status(200).json(result);

    } catch (error) {

      if (error instanceof AppError) {
        console.log('AppError caught:', {
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode
        });

        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode
        });
      } else {

        console.log('Non-AppError caught, sending generic 500 response');

        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }

      console.log('=== GET ALL SPECIALIZATIONS ERROR END ===');
    }
  }

  private parseDate(dateString: string, type: 'from' | 'to'): Date | null {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new AppError(`Invalid ${type} date format. Use ISO format (YYYY-MM-DD)`, 'INVALID_DATE', 400);
    }
    
    if (type === 'from') {
      // Start of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      return startOfDay;
    } else {
      // End of day
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay;
    }
  }

  async handleUpdate(req: Request, res: Response): Promise<void> {
    try {
      const tokenUserType = (req as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const { id } = req.params;
      const { name } = req.body;

      if (!name || name.trim().length === 0) {
        throw new AppError('Specialization name is required', 'SPECIALIZATION_001', 400);
      }

      if (!id) {
        throw new AppError('Specialization ID is required', 'SPECIALIZATION_002', 400);
      }

      const request: UpdateSpecializationRequest = { name: name.trim() };

      const result = await this.specializationUseCase.update(id, request);

      res.status(200).json(result);

    } catch (error) {

      if (error instanceof AppError) {
        console.log('AppError caught:', {
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode
        });

        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode
        });
      } else {

        console.log('Non-AppError caught, sending generic 500 response');

        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }

      console.log('=== UPDATE SPECIALIZATION ERROR END ===');
    }
  }

  async handleDelete(req: Request, res: Response): Promise<void> {
    try {
      const tokenUserType = (req as any).user?.userType;

      if (tokenUserType !== "admin") {
        throw new AppError('User not authenticated', 'UNAUTHORIZED', 401);
      }

      const { id } = req.params;

      if (!id) {
        throw new AppError('Specialization ID is required', 'SPECIALIZATION_002', 400);
      }

      const result = await this.specializationUseCase.delete(id);

      res.status(200).json(result);

    } catch (error) {

      if (error instanceof AppError) {
        console.log('AppError caught:', {
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode
        });

        res.status(error.statusCode).json({
          success: false,
          message: error.message,
          error: error.errorCode
        });
      } else {

        console.log('Non-AppError caught, sending generic 500 response');

        res.status(500).json({
          success: false,
          message: 'Internal server error',
          error: 'INTERNAL_SERVER_ERROR'
        });
      }

      console.log('=== DELETE SPECIALIZATION ERROR END ===');
    }
  }
}