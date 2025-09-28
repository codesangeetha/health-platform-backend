import { IAppointmentRepository } from './appointment-repository.interface';
import { Appointment } from '@/domain/entities/appointment.entity';
import { AppError } from '@/shared/errors/app-error';

export class AppointmentRepositoryMongoDB implements IAppointmentRepository {
    constructor(private readonly appointmentModel: any) { }

    async create(appointment: any): Promise<Appointment> {
        try {
            const doc = await this.appointmentModel.create(appointment);
            return Appointment.fromMongoDocument(doc.toObject());
        } catch (error) {
            
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
}
