import { UpdatePrescriptionRequest, UpdatePrescriptionResponse } from '@/domain/types/prescription/update-prescription.type';

export interface IUpdatePrescriptionUseCase {
    execute(prescriptionId: string, request: UpdatePrescriptionRequest, doctorId: string): Promise<UpdatePrescriptionResponse>;
}