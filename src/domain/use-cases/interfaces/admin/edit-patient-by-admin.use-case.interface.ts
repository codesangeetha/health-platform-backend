import { EditPatientByAdminRequest, EditPatientByAdminResponse } from '@/domain/types/admin/edit-patient-by-admin.type';

export interface IEditPatientByAdminUseCase {
  execute(patientId: string, request: EditPatientByAdminRequest): Promise<EditPatientByAdminResponse>;
}