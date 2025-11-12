import { Request, Response } from 'express';
import { 
    CreateSpecializationRequest,
    UpdateSpecializationRequest 
} from '@/domain/types/admin/specialization.type';

export interface ISpecializationController {
    // Create a new specialization
    handleCreate(req: Request, res: Response): Promise<void>;
    
    // Get all specializations
    handleGetAll(req: Request, res: Response): Promise<void>;
    
    // Update a specialization
    handleUpdate(req: Request, res: Response): Promise<void>;
    
    // Delete a specialization
    handleDelete(req: Request, res: Response): Promise<void>;
}