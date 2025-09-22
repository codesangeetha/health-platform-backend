import { AppError } from '@/shared/errors/app-error';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { UpdateAppointmentStatusRequest, UpdateAppointmentStatusResponse } from '@/domain/types/appointments/update-appointment-status.type';
import { IUpdateAppointmentStatusUseCase } from '../interfaces/appointments/update-appointment-status.use-case.interface';

export class UpdateAppointmentStatusUseCase implements IUpdateAppointmentStatusUseCase {
    constructor(
        private readonly appointmentRepository: IAppointmentRepository
    ) { }

    async execute(appointmentId: string, request: UpdateAppointmentStatusRequest): Promise<UpdateAppointmentStatusResponse> {
        // Validate input
        this.validateRequest(request);

        const appointment = await this.appointmentRepository.updateStatus(appointmentId, request);

        if (!appointment) {
            throw new AppError('Update appointment not found', 'APPOINTMENT_NOT_FOUND', 404);
        }

        // Return response
        return {
            success: true,
            message: 'Operation successful',
            timestamp: new Date().toISOString(),
            data: {
                appointmentId: appointment.id,
                status: appointment.status,
                reason: appointment.reason,
                updatedAt: appointment.updatedAt.toISOString()
            },
        };
    }

    private validateRequest(request: UpdateAppointmentStatusRequest): void {
        if (!request.status) {
            throw new AppError('Status is required', 'INVALID_INPUT', 400);
        }

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(request.status)) {
            throw new AppError('Invalid status value', 'INVALID_STATUS', 400);
        }
    }
}