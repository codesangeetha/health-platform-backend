import { GetPatientDashboardCountsRequest, GetPatientDashboardCountsResponse } from '@/domain/types/patient/patient-dashboard-counts.type';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IGetPatientDashboardCountsUseCase } from '../interfaces/patient/get-patient-dashboard-counts.use-case.interface';
import { AppError } from '@/shared/errors/app-error';

export class GetPatientDashboardCountsUseCase implements IGetPatientDashboardCountsUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: GetPatientDashboardCountsRequest): Promise<GetPatientDashboardCountsResponse> {
        try {
            // Validate input
            if (!request.patientId) {
                return {
                    success: false,
                    message: 'Patient ID is required',
                    timestamp: new Date().toISOString(),
                    data: {
                        upcomingAppointments: 0,
                        allAppointments: 0,
                        lastVisitDate: null
                    }
                };
            }

            // Get all the dashboard counts in parallel for better performance
            console.log(`Getting dashboard counts for patient: ${request.patientId}`);
            
            const [upcomingAppointments, allAppointments, lastVisitDate] = await Promise.all([
                this.appointmentRepository.countUpcomingAppointmentsByPatient(request.patientId),
                this.appointmentRepository.countAllAppointmentsByPatient(request.patientId),
                this.appointmentRepository.getLastVisitDateByPatient(request.patientId)
            ]);

            console.log('Dashboard counts result:', {
                upcomingAppointments,
                allAppointments,
                lastVisitDate
            });

            let lastVisitDateString: string | null = null;
            if (lastVisitDate !== null) {
                lastVisitDateString = lastVisitDate.toISOString().split('T')[0] as string; // Format as YYYY-MM-DD
            }

            return {
                success: true,
                message: 'Patient dashboard counts retrieved successfully',
                timestamp: new Date().toISOString(),
                data: {
                    upcomingAppointments,
                    allAppointments,
                    lastVisitDate: lastVisitDateString
                }
            };
        } catch (error) {
            console.error('Error getting patient dashboard counts:', error);
            
            // If it's an AppError, re-throw it
            if (error instanceof AppError) {
                throw error;
            }
            
            return {
                success: false,
                message: 'Failed to retrieve patient dashboard counts',
                timestamp: new Date().toISOString(),
                data: {
                    upcomingAppointments: 0,
                    allAppointments: 0,
                    lastVisitDate: null
                }
            };
        }
    }
}