// Request type - this will be passed in query parameters
export interface GetDoctorCalendarRequest {
    year: number;
    month: number; // 1-12
}

// Day booking information
export interface DayBooking {
    date: string; // YYYY-MM-DD format
    day: number; // Day of month
    dayName: string; // e.g., "Monday"
    bookings: Array<{
        appointmentId: string;
        patient: {
            patientId: string;
            firstName: string;
            lastName: string;
            age: number;
        };
        time: string;
        status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
        appointmentType: 'in-person' | 'video';
        reason?: string;
    }>;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    completedBookings: number;
}

// Response type
export interface GetDoctorCalendarResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        year: number;
        month: number;
        calendar: {
            monthName: string;
            daysInMonth: number;
            firstDayOfWeek: number; // 0=Sunday, 1=Monday, etc.
            bookingsByDate: DayBooking[];
        };
        monthlyStats: {
            totalBookings: number;
            confirmedBookings: number;
            pendingBookings: number;
            completedBookings: number;
            cancelledBookings: number;
        };
    };
}