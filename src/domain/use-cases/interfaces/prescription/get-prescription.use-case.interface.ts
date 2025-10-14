import { GetPrescriptionResponse } from '@/domain/types/prescription/get-prescription.type';

export interface IGetPrescriptionUseCase {
    execute(prescriptionId: string): Promise<GetPrescriptionResponse>;
}