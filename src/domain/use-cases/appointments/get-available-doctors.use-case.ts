import { AppError } from '@/shared/errors/app-error';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IGetAvailableDoctorsUseCase } from '../interfaces/appointments/get-available-doctors.use-case.interface';
import { GetAvailableDoctorsRequest, GetAvailableDoctorsResponse } from '@/domain/types/appointments/get-available-doctors.type';

export class GetAvailableDoctorsUsecase implements IGetAvailableDoctorsUseCase {
    constructor(
        private readonly docRepository: IDoctorRepository,
    ) { }

    async execute(request: GetAvailableDoctorsRequest): Promise<GetAvailableDoctorsResponse> {
        const page = request.page ?? 1;
        const limit = request.limit ?? 10;
        const specialization = request.specialization;
        const availableDays = request.availableDays ?? [];
        const searchName = request.searchName;

        const { doctors, total } = await this.docRepository.findAvailableDoctors(
            page,
            limit,
            specialization,
            availableDays,
            searchName
        );

        if (!doctors || doctors.length === 0) {
            throw new AppError('Doctors not found', 'DOCTORS_NOT_FOUND', 404);
        }

        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Doctors retrieved successfully',
            data: {
                doctors: doctors,
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
