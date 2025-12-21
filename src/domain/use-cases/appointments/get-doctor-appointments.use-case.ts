import { GetDoctorAppointmentsRequest, GetDoctorAppointmentsResponse } from '@/domain/types/appointments/get-doctor-appointments.type';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IGetDoctorAppointmentsUseCase } from '../interfaces/appointments/get-doctor-appointments.use-case.interface';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { Types } from 'mongoose';

export class GetDoctorAppointmentsUseCase implements IGetDoctorAppointmentsUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: GetDoctorAppointmentsRequest, doctorId: string): Promise<GetDoctorAppointmentsResponse> {
        const page = request.page ?? 1;
        const limit = request.limit ?? 10;

        const { appointments, total } = await this.appointmentRepository.findAllByDoctor(
            page,
            limit,
            request.date,
            request.status,
            doctorId
        );

        // Transform appointments to include patient details
        const transformedAppointments = await Promise.all(
            appointments.map(async (appointment) => {
                // Get patient details
                const patient = await PatientModel.findById(appointment.patientId).lean();
                
                // Calculate patient age
                let age = 0;
                if (patient?.dateOfBirth) {
                    const birthDate = new Date(patient.dateOfBirth);
                    const today = new Date();
                    age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                }

                return {
                    appointmentId: appointment.id,
                    patient: {
                        patientId: appointment.patientId,
                        firstName: patient?.firstName || '',
                        lastName: patient?.lastName || '',
                        age
                    },
                    date: appointment.date ? appointment.date.toISOString().split('T')[0] : '',
                    time: appointment.time,
                    status: appointment.status,
                    appointmentType: (appointment.isVideoCall ? 'video' : 'in-person') as 'in-person' | 'video',
                    reason: appointment.reason,
                    createdAt: appointment.createdAt ? appointment.createdAt.toISOString() : ''
                };
            })
        );

        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Operation successful',
            timestamp: new Date().toISOString(),
            data: {
                appointments: transformedAppointments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            }
        };
    }
}