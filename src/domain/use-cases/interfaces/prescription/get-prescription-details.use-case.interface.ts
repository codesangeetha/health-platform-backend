import { GetPrescriptionDetailsResponse } from '@/domain/types/prescription/get-prescription-details.type';

export interface IGetPrescriptionDetailsUseCase {
    execute(appointmentId: string): Promise<GetPrescriptionDetailsResponse>;
}