// src/domain/use-cases/pharmacyAdmin/upload-prescription.use-case.ts
import { AppError } from '@/shared/errors/app-error';
import { UploadPrescriptionRequest, UploadPrescriptionResponse } from '@/domain/types/pharmacyAdmin/upload-prescription.type';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { IUploadPrescriptionUseCase } from '../interfaces/pharmacyAdmin/upload-prescription.use-case.interface';

export class UploadPrescriptionUseCase implements IUploadPrescriptionUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async execute(request: UploadPrescriptionRequest): Promise<UploadPrescriptionResponse> {
        // Validate input
        this.validateUploadRequest(request);

        // Prepare prescription data
        const prescriptionData = {
            prescriptionFileName: request.fileName,
            doctorId: request.doctorId,
            notes: request.notes,
            uploadDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const prescription = await this.prescriptionRepository.create(prescriptionData);

        return {
            success: true,
            message: 'Prescription uploaded successfully',
            timestamp: new Date().toISOString(),
            data: {
                prescriptionId: prescription.id,
                fileName: prescription.prescriptionFileName,
                doctorId: prescription.doctorId,
                uploadDate: prescription.uploadDate.toISOString(),
                createdAt: prescription.createdAt.toISOString()
            }
        };
    }

    private validateUploadRequest(request: UploadPrescriptionRequest): void {
        const requiredFields = ['fileName', 'originalName', 'filePath', 'doctorId'];
        for (const field of requiredFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'PRESCRIPTION_001', 400);
            }
        }
    }
}
