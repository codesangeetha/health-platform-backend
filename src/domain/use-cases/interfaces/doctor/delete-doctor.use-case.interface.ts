import { DeleteDoctorRequest, DeleteDoctorResponse } from '@/domain/types/doctor/delete-doctor.type';

export interface IDeleteDoctorUseCase {
    execute(doctorId: string, request: DeleteDoctorRequest): Promise<DeleteDoctorResponse>;
}