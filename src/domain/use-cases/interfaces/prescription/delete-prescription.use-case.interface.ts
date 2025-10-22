import { DeletePrescriptionResponse } from '@/domain/types/prescription/delete-prescription.type';

export interface IDeletePrescriptionUseCase {
    execute(prescriptionId: string): Promise<DeletePrescriptionResponse>;
}