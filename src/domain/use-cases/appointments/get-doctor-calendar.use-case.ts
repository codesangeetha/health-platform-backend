import { GetDoctorCalendarRequest, GetDoctorCalendarResponse, DayBooking } from '@/domain/types/appointments/get-doctor-calendar.type';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IGetDoctorCalendarUseCase } from '../interfaces/appointments/get-doctor-calendar.use-case.interface';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { Types } from 'mongoose';

export class GetDoctorCalendarUseCase implements IGetDoctorCalendarUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(request: GetDoctorCalendarRequest, doctorId: string): Promise<GetDoctorCalendarResponse> {
        // Validate input
        if (!request.year || request.year < 2020 || request.year > 2030) {
            throw new Error('Invalid year');
        }
        if (!request.month || request.month < 1 || request.month > 12) {
            throw new Error('Invalid month');
        }

        // Calculate date range for the month
        const startDate = new Date(request.year, request.month - 1, 1);
        const endDate = new Date(request.year, request.month, 0, 23, 59, 59);

        // Format dates for query
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Get all appointments for the doctor in the specified month
        const appointments = await this.appointmentRepository.findAllByDoctorAndDateRange(
            doctorId,
            startDateStr!,
            endDateStr!
        );

        // Group appointments by date
        const appointmentsByDate = new Map<string, any[]>();
        
        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);
            // Only include appointments within the specified month
            if (appointmentDate >= startDate && appointmentDate <= endDate) {
                const dateKey = appointmentDate.toISOString().split('T')[0]!;
                if (!appointmentsByDate.has(dateKey)) {
                    appointmentsByDate.set(dateKey, []);
                }
                appointmentsByDate.get(dateKey)!.push(appointment);
            }
        });

        // Generate calendar data
        const daysInMonth = new Date(request.year, request.month, 0).getDate();
        const firstDayOfMonth = new Date(request.year, request.month - 1, 1).getDay();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Generate bookings for each day in the month
        const bookingsByDate: DayBooking[] = [];
        let monthlyStats = {
            totalBookings: 0,
            confirmedBookings: 0,
            pendingBookings: 0,
            completedBookings: 0,
            cancelledBookings: 0
        };

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(request.year, request.month - 1, day);
            const dateKey = date.toISOString().split('T')[0];
            const dayOfWeek = date.getDay();
            
            const dayAppointments = appointmentsByDate.get(dateKey!) || [];
            
            // Transform appointments for this day
            const transformedBookings = await Promise.all(
                dayAppointments.map(async (appointment) => {
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

                    // Update monthly stats
                    monthlyStats.totalBookings++;
                    switch (appointment.status) {
                        case 'confirmed':
                            monthlyStats.confirmedBookings++;
                            break;
                        case 'pending':
                            monthlyStats.pendingBookings++;
                            break;
                        case 'completed':
                            monthlyStats.completedBookings++;
                            break;
                        case 'cancelled':
                            monthlyStats.cancelledBookings++;
                            break;
                    }

                    return {
                        appointmentId: appointment.id,
                        patient: {
                            patientId: appointment.patientId,
                            firstName: patient?.firstName || '',
                            lastName: patient?.lastName || '',
                            age
                        },
                        time: appointment.time,
                        status: appointment.status,
                        appointmentType: (appointment.isVideoCall ? 'video' : 'in-person') as 'in-person' | 'video',
                        reason: appointment.reason
                    };
                })
            );

            // Count bookings by status for this day
            const dayStats = {
                totalBookings: transformedBookings.length,
                confirmedBookings: transformedBookings.filter(b => b.status === 'confirmed').length,
                pendingBookings: transformedBookings.filter(b => b.status === 'pending').length,
                completedBookings: transformedBookings.filter(b => b.status === 'completed').length
            };

            bookingsByDate.push({
                date: dateKey!,
                day,
                dayName: dayNames[dayOfWeek]!,
                bookings: transformedBookings.sort((a, b) => a.time.localeCompare(b.time)), // Sort by time
                ...dayStats
            });
        }

        return {
            success: true,
            message: 'Calendar data retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                year: request.year,
                month: request.month,
                calendar: {
                    monthName: monthNames[request.month - 1]!,
                    daysInMonth,
                    firstDayOfWeek: firstDayOfMonth,
                    bookingsByDate
                },
                monthlyStats
            }
        };
    }
}