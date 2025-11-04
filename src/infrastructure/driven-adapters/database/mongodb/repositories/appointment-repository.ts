import { IAppointmentRepository } from './appointment-repository.interface';
import { Appointment } from '@/domain/entities/appointment.entity';
import { AppError } from '@/shared/errors/app-error';

export class AppointmentRepositoryMongoDB implements IAppointmentRepository {
    constructor(private readonly appointmentModel: any) { }

    async create(appointment: any): Promise<Appointment> {
        try {
            console.log("=== REPOSITORY CREATE START ===");
            console.log("Appointment data received:", JSON.stringify(appointment, null, 2));
            console.log("Appointment model:", this.appointmentModel.modelName);

            const doc = await this.appointmentModel.create(appointment);
            console.log("Document created successfully:", doc._id);
            return Appointment.fromMongoDocument(doc.toObject());
        } catch (error: any) {
            console.error('=== DATABASE ERROR DETAILS ===');
            console.error('Error name:', error?.name);
            console.error('Error message:', error?.message);
            console.error('Error code:', error?.code);
            console.error('Error codeName:', error?.codeName);
            console.error('Full error object:', JSON.stringify(error, null, 2));

            // Check for specific MongoDB errors
            if (error?.name === 'ValidationError') {
                console.error('Validation failed for fields:', Object.keys(error.errors));
                for (const [field, err] of Object.entries(error.errors)) {
                    console.error(`Field ${field}:`, (err as any)?.message);
                }
            }

            if (error?.code === 11000) {
                console.error('Duplicate key error - possible double booking');
                console.error('Key pattern:', error?.keyPattern);
                console.error('Key value:', error?.keyValue);
            }

            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async findAll(
        page: number,
        limit: number,
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
        patientId?: string
    ): Promise<{ appointments: Appointment[]; total: number }> {
        try {
            const skip = (page - 1) * limit;

            // Build filter dynamically
            const filter: any = {};
            if (status) {
                filter.status = status;
            }
            if (patientId) {
                filter.patientId = patientId;
            }

            const [docs, total] = await Promise.all([
                this.appointmentModel.find(filter).skip(skip).limit(limit).lean(),
                this.appointmentModel.countDocuments(filter)
            ]);

            return {
                appointments: docs.map((doc: any) => Appointment.fromMongoDocument(doc)),
                total
            };
        } catch (error) {
            console.error('err', error);
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async findAllByDoctor(
        page: number,
        limit: number,
        date?: string,
        status?: 'pending' | 'confirmed' | 'cancelled' | 'completed',
        doctorId?: string
    ): Promise<{ appointments: Appointment[]; total: number }> {
        try {
            const skip = (page - 1) * limit;

            // Build filter dynamically
            const filter: any = {};
            if (doctorId) {
                filter.doctorId = doctorId;
            }
            if (date) {
                filter.date = date;
            }
            if (status) {
                filter.status = status;
            }

            const [docs, total] = await Promise.all([
                this.appointmentModel.find(filter).skip(skip).limit(limit).lean(),
                this.appointmentModel.countDocuments(filter)
            ]);

            return {
                appointments: docs.map((doc: any) => Appointment.fromMongoDocument(doc)),
                total
            };
        } catch (error) {
            console.error('err', error);
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async update(
        appointmentId: string,
        updates: { newDate?: string; newTime?: string; reason?: string }
    ): Promise<Appointment | null> {
        try {
            const appointment = await this.appointmentModel.findById(appointmentId);

            if (!appointment) {
                throw new AppError('Appointment not found', 'NOT_FOUND', 404);
            }

            if (updates.newDate) {
                appointment.date = updates.newDate;
            }

            if (updates.newTime) {
                appointment.time = updates.newTime;
            }

            if (updates.reason) {
                appointment.reason = appointment.reason
                    ? `${appointment.reason} | ${updates.reason}`
                    : updates.reason;
            }

            const saved = await appointment.save();

            return Appointment.fromMongoDocument(saved.toObject());
        } catch (error) {
            console.error('err', error);
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async updateStatus(
        appointmentId: string,
        updates: { status: 'pending' | 'confirmed' | 'cancelled' | 'completed'; reason?: string }
    ): Promise<Appointment | null> {
        try {
            const appointment = await this.appointmentModel.findById(appointmentId);

            if (!appointment) {
                throw new AppError('Appointment not found', 'NOT_FOUND', 404);
            }

            appointment.status = updates.status;

            if (updates.reason) {
                appointment.reason = appointment.reason
                    ? `${appointment.reason} | ${updates.reason}`
                    : updates.reason;
            }

            const saved = await appointment.save();

            return Appointment.fromMongoDocument(saved.toObject());
        } catch (error) {
            console.error('err', error);
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async findById(id: string): Promise<Appointment | null> {
        try {
            const doc = await this.appointmentModel.findById(id).lean();
            return doc ? Appointment.fromMongoDocument(doc) : null;
        } catch (error) {
            console.error('err', error);
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async count(): Promise<number> {
        try {
            return await this.appointmentModel.countDocuments();
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async countUpcomingAppointmentsByPatient(patientId: string): Promise<number> {
        try {
            const now = new Date();
            const upcomingFilter = {
                patientId: patientId,
                date: { $gte: now },
                status: { $in: ['pending', 'confirmed'] }
            };
            return await this.appointmentModel.countDocuments(upcomingFilter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async countAllAppointmentsByPatient(patientId: string): Promise<number> {
        try {
            const filter = { patientId: patientId };
            return await this.appointmentModel.countDocuments(filter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async getLastVisitDateByPatient(patientId: string): Promise<Date | null> {
        try {
            const lastVisit = await this.appointmentModel
                .findOne({
                    patientId: patientId,
                    status: 'completed'
                })
                .sort({ date: -1 })
                .lean();
            
            return lastVisit ? new Date(lastVisit.date) : null;
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    // Doctor dashboard methods
    async countTodayAppointmentsByDoctor(doctorId: string): Promise<number> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const filter = {
                doctorId: doctorId,
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            };
            
            return await this.appointmentModel.countDocuments(filter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async countAllAppointmentsByDoctor(doctorId: string): Promise<number> {
        try {
            const filter = { doctorId: doctorId };
            return await this.appointmentModel.countDocuments(filter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async countPendingConsultationsByDoctor(doctorId: string): Promise<number> {
        try {
            const filter = {
                doctorId: doctorId,
                status: { $in: ['pending', 'confirmed'] }
            };
            return await this.appointmentModel.countDocuments(filter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }

    async countTodayCompletedConsultationsByDoctor(doctorId: string): Promise<number> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const filter = {
                doctorId: doctorId,
                status: 'completed',
                date: {
                    $gte: today,
                    $lt: tomorrow
                }
            };
            
            return await this.appointmentModel.countDocuments(filter);
        } catch (error) {
            throw new AppError('Database error', 'DATABASE_ERROR', 500);
        }
    }
}
