import { GetPrescriptionResponse } from '@/domain/types/prescription/get-prescription.type';

export interface IGetPrescriptionByAppointmentUseCase {
    execute(appointmentId: string): Promise<GetPrescriptionResponse>;
}