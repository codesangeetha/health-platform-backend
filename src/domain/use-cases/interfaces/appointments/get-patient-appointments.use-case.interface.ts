import { GetPatientAppointmentsRequest,GetPatientAppointmentsResponse } from "@/domain/types/appointments/get-patient-appointments.type";


export interface IGetPatientAppointmentsUseCase {
  execute(request: GetPatientAppointmentsRequest, patientId: string): Promise<GetPatientAppointmentsResponse>;
}