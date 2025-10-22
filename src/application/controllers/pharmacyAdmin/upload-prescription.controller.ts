// src/application/controllers/pharmacyAdmin/upload-prescription.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IUploadPrescriptionUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/upload-prescription.use-case.interface';
import { IUploadPrescriptionController } from '../interfaces/pharmacyAdmin/upload-prescription.controller.interface';
import * as fs from 'fs';
import * as path from 'path';


export class UploadPrescriptionController implements IUploadPrescriptionController {
    constructor(
        private readonly uploadPrescriptionUseCase: IUploadPrescriptionUseCase
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            

            // Check if file was uploaded
            if (!(req as any).file) {
                throw new AppError('No prescription file provided', 'PRESCRIPTION_FILE_REQUIRED', 400);
            }

            // Extract request data
            const { doctorId, notes } = (req as any).body;
            const uploadedFile = (req as any).file;

            // Validate required fields
            if (!doctorId) {
                throw new AppError('Doctor ID is required', 'DOCTOR_ID_REQUIRED', 400);
            }

            // Process file upload
            const { fileName, filePath } = await this.processFileUpload(uploadedFile);

            // Execute use case
            const result = await this.uploadPrescriptionUseCase.execute({
                fileName: fileName,
                originalName: uploadedFile.originalname,
                filePath: filePath,
                doctorId: doctorId,
                ...(notes && { notes: notes })
            });

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
        }
    }

    /**
     * Process the uploaded file and return the generated filename and path
     */
    private async processFileUpload(file: any): Promise<{ fileName: string; filePath: string }> {
        if (!file) {
            throw new AppError('No file provided for processing', 'FILE_PROCESSING_ERROR', 400);
        }

        try {
            // Validate the uploaded file
            this.validateUploadedFile(file);

            // Generate unique filename
            const fileName = this.generatePrescriptionFileName(file.originalname);

            // Get full file path
            const filePath = this.getFilePath(fileName);

            // Ensure upload directory exists
            await this.ensureUploadDirectoryExists(filePath);

            // Move file from temp location to permanent location
            const tempFilePath = file.path;
            const permanentFilePath = path.join(process.cwd(), filePath);

            await fs.promises.rename(tempFilePath, permanentFilePath);

            return { fileName, filePath };
        } catch (error) {
            console.error('File processing error:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError('Failed to process uploaded file', 'FILE_PROCESSING_ERROR', 500);
        }
    }

    /**
     * Generate a unique filename for the prescription
     */
    private generatePrescriptionFileName(originalName: string): string {
        const timestamp = Date.now();
        const extension = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, extension);
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        
        return `prescription_${timestamp}_${sanitizedName}${extension}`;
    }

    /**
     * Get the file path relative to the project root
     */
    private getFilePath(fileName: string): string {
        return path.join('uploads', 'prescriptions', fileName);
    }

    /**
     * Ensure the upload directory exists, create if it doesn't
     */
    private async ensureUploadDirectoryExists(filePath: string): Promise<void> {
        const dir = path.dirname(path.join(process.cwd(), filePath));
        
        try {
            await fs.promises.access(dir);
        } catch (error) {
            // Directory doesn't exist, create it
            await fs.promises.mkdir(dir, { recursive: true });
        }
    }

    /**
     * Validate the uploaded file
     */
    private validateUploadedFile(file: any): void {
        if (!file) {
            throw new AppError('No file provided for validation', 'FILE_VALIDATION_ERROR', 400);
        }

        // Check file size (e.g., max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new AppError('File size too large. Maximum size is 10MB', 'FILE_TOO_LARGE', 400);
        }

        // Check file type (optional - allow common image and document formats)
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'image/webp'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new AppError(
                'Invalid file type. Allowed types: JPEG, PNG, GIF, PDF, WebP',
                'INVALID_FILE_TYPE',
                400
            );
        }
    }
}
