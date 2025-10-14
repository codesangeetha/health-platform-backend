import { CreatePrescriptionRequest, CreatePrescriptionResponse } from '@/domain/types/prescription/create-prescription.type';

export interface ICreatePrescriptionUseCase {
    execute(request: CreatePrescriptionRequest, doctorId: string): Promise<CreatePrescriptionResponse>;
}