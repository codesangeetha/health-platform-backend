import { GetDoctorDashboardCountsRequest, GetDoctorDashboardCountsResponse } from '@/domain/types/doctor/doctor-dashboard-counts.type';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IGetDoctorDashboardCountsUseCase } from '../interfaces/doctor/get-doctor-dashboard-counts.use-case.interface';
import { AppError } from '@/shared/errors/app-error';

export class GetDoctorDashboardCountsUseCase implements IGetDoctorDashboardCountsUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: GetDoctorDashboardCountsRequest): Promise<GetDoctorDashboardCountsResponse> {
        try {
            // Validate input
            if (!request.doctorId) {
                return {
                    success: false,
                    message: 'Doctor ID is required',
                    timestamp: new Date().toISOString(),
                    data: {
                        todayAppointments: 0,
                        totalAppointments: 0,
                        pendingConsultations: 0,
                        todayCompletedConsultations: 0
                    }
                };
            }

            // Get all the dashboard counts in parallel for better performance
            console.log(`Getting doctor dashboard counts for doctor: ${request.doctorId}`);
            
            const [todayAppointments, totalAppointments, pendingConsultations, todayCompletedConsultations] = await Promise.all([
                this.appointmentRepository.countTodayAppointmentsByDoctor(request.doctorId),
                this.appointmentRepository.countAllAppointmentsByDoctor(request.doctorId),
                this.appointmentRepository.countPendingConsultationsByDoctor(request.doctorId),
                this.appointmentRepository.countTodayCompletedConsultationsByDoctor(request.doctorId)
            ]);

            console.log('Doctor dashboard counts result:', {
                todayAppointments,
                totalAppointments,
                pendingConsultations,
                todayCompletedConsultations
            });

            return {
                success: true,
                message: 'Doctor dashboard counts retrieved successfully',
                timestamp: new Date().toISOString(),
                data: {
                    todayAppointments,
                    totalAppointments,
                    pendingConsultations,
                    todayCompletedConsultations
                }
            };
        } catch (error) {
            console.error('Error getting doctor dashboard counts:', error);
            
            // If it's an AppError, re-throw it
            if (error instanceof AppError) {
                throw error;
            }
            
            return {
                success: false,
                message: 'Failed to retrieve doctor dashboard counts',
                timestamp: new Date().toISOString(),
                data: {
                    todayAppointments: 0,
                    totalAppointments: 0,
                    pendingConsultations: 0,
                    todayCompletedConsultations: 0
                }
            };
        }
    }
}