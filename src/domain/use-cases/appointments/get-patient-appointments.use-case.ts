import { GetPatientAppointmentsRequest, GetPatientAppointmentsResponse } from '@/domain/types/appointments/get-patient-appointments.type';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IGetPatientAppointmentsUseCase } from '../interfaces/appointments/get-patient-appointments.use-case.interface';

export class GetPatientAppointmentsUseCase implements IGetPatientAppointmentsUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: GetPatientAppointmentsRequest, patientId: string): Promise<GetPatientAppointmentsResponse> {


        const page = request.page ?? 1;
        const limit = request.limit ?? 10;

        const { appointments, total } = await this.appointmentRepository.findAll(page, limit, request.status, patientId);


        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Appointments retrieved successfully',
            data: {
                appointments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            },
            timestamp: new Date().toISOString()
        };
    }

}
