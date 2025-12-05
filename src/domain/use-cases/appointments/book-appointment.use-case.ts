import { AppError } from '@/shared/errors/app-error';
import { IBookAppointmentUseCase } from '../interfaces/appointments/book-appointment.use-case.interface';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IEmailService } from '@/infrastructure/driven-adapters/email/email.service.interface';
import { BookAppointmentRequest, BookAppointmentResponse } from '@/domain/types/appointments/book-appointment.type';
import { Appointment } from '@/domain/entities/appointment.entity';
import { Patient } from '@/domain/entities/patient.entity';
import { Doctor } from '@/domain/entities/doctor.entity';

export class BookAppointmentUseCase implements IBookAppointmentUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository,
        private readonly patientRepository: IPatientRepository,
        private readonly doctorRepository: IDoctorRepository,
        private readonly emailService: IEmailService
    ) { }

    async execute(request: BookAppointmentRequest, patientId: string): Promise<BookAppointmentResponse> {
        console.log('=== BOOK APPOINTMENT START ===');
        console.log('Patient ID:', patientId);
        console.log('Request data:', JSON.stringify(request, null, 2));

        // Validate input
        this.validateRegistrationRequest(request);

        let savedAppointment;

        const appointmentData = {
            patientId: patientId,
            doctorId: request.doctorId,
            date: request.date,
            time: request.time,
            isVideoCall: request.isVideoCall,
            reason: request.reason,
            symptoms: request.symptoms
        };

        console.log('Appointment data to be saved:', JSON.stringify(appointmentData, null, 2));

        try {
            savedAppointment = await this.appointmentRepository.create(appointmentData);
            console.log('Appointment saved successfully:', savedAppointment.id);

            // Send video call reminder email if it's a video appointment
            if (savedAppointment.isVideoCall) {
                try {
                    // Get patient details
                    const patient = await this.patientRepository.findByUserId(patientId);
                    if (!patient) {
                        console.warn('Patient not found for video call email:', patientId);
                    } else {
                        // Get doctor details
                        const doctor = await this.doctorRepository.findByUserId(request.doctorId);
                        
                        // Generate video call link (you can customize this URL based on your video call service)
                        const videoCallLink = `https://your-health-platform.com/video-call/${savedAppointment.id}`;
                        
                        const emailSubject = 'Video Call Appointment Reminder';
                        const emailContent = `
                            <html>
                                <head>
                                    <meta charset="utf-8">
                                    <title>Video Call Appointment Reminder</title>
                                    <style>
                                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                                        .content { padding: 20px; background-color: #f9f9f9; }
                                        .appointment-details { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                                        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
                                        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <div class="header">
                                            <h1>Video Call Appointment Reminder</h1>
                                        </div>
                                        <div class="content">
                                            <p>Dear ${patient.firstName} ${patient.lastName},</p>
                                            
                                            <p>This is a reminder for your upcoming video call appointment:</p>
                                            
                                            <div class="appointment-details">
                                                <h3>Appointment Details</h3>
                                                <p><strong>Doctor:</strong> Dr. ${doctor?.firstName || ''} ${doctor?.lastName || ''}</p>
                                                <p><strong>Date:</strong> ${new Date(request.date).toLocaleDateString()}</p>
                                                <p><strong>Time:</strong> ${request.time}</p>
                                                <p><strong>Reason:</strong> ${request.reason}</p>
                                                ${request.symptoms ? `<p><strong>Symptoms:</strong> ${request.symptoms}</p>` : ''}
                                            </div>
                                            
                                            <p><strong>Important:</strong> Please ensure you have a stable internet connection and a device with camera and microphone capabilities.</p>
                                            
                                            <div style="text-align: center; margin: 30px 0;">
                                                <a href="${videoCallLink}" class="button">Join Video Call</a>
                                            </div>
                                            
                                            <p>If you need to reschedule or cancel this appointment, please contact us at least 24 hours in advance.</p>
                                            
                                            <p>Thank you for choosing our healthcare platform.</p>
                                        </div>
                                        <div class="footer">
                                            <p>This is an automated email. Please do not reply to this message.</p>
                                            <p>© 2024 Health Platform. All rights reserved.</p>
                                        </div>
                                    </div>
                                </body>
                            </html>
                        `;

                        await this.emailService.sendEmail(patient.email, emailSubject, emailContent);
                        console.log('Video call reminder email sent successfully to:', patient.email);
                    }
                } catch (emailError) {
                    console.error('Failed to send video call reminder email:', emailError);
                    // Don't throw error here - appointment booking should still succeed even if email fails
                }
            }
        } catch (error) {
            console.error('Error in use case:', error);
            throw error;
        }

        return {
            success: true,
            message: 'Appointment created successfully',
            timestamp: new Date().toISOString(),
            data: {
                appointmentId: savedAppointment.id,
                doctorId: savedAppointment.doctorId,
                patientId: savedAppointment.patientId,
                date: savedAppointment.date.toISOString(),
                time: savedAppointment.time,
                status: savedAppointment.status,
                isVideoCall: savedAppointment.isVideoCall
            }
        };
    }

    private validateRegistrationRequest(request: BookAppointmentRequest): void {
        const commonFields = ['doctorId', 'date', 'time', 'reason', 'symptoms'];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }
        
        // Special validation for isVideoCall - it should be explicitly true or false
        if (typeof request.isVideoCall !== 'boolean') {
            throw new AppError('isVideoCall must be a boolean value', 'USER_001', 400);
        }
    }
}