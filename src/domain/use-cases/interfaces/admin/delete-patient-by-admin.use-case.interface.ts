import { DeletePatientByAdminRequest, DeletePatientByAdminResponse } from '@/domain/types/admin/delete-patient-by-admin.type';

export interface IDeletePatientByAdminUseCase {
  execute(patientId: string, request?: DeletePatientByAdminRequest): Promise<DeletePatientByAdminResponse>;
}