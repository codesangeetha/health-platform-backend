import { DoctorPasswordSetRequest, DoctorPasswordSetResponse } from '@/domain/types/authentication/doctor-password-set.type';

export interface IDoctorPasswordSetUseCase {
  execute(request: DoctorPasswordSetRequest): Promise<DoctorPasswordSetResponse>;
}