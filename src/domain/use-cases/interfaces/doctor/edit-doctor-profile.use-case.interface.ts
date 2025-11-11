import { EditDoctorProfileRequest, EditDoctorProfileResponse } from '@/domain/types/doctor/edit-doctor-profile.type';

export interface IEditDoctorProfileUseCase {
    execute(doctorId: string, request: EditDoctorProfileRequest): Promise<EditDoctorProfileResponse>;
}