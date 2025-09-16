import { IGetAllUsersUseCase } from '../interfaces/admin/get-all-users.use-case.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { GetAllUsersRequest, GetAllUsersResponse } from '@/domain/types/admin/get-all-users.type';
import { AppError } from '@/shared/errors/app-error';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { Doctor } from '@/domain/entities/doctor.entity';
import { Patient } from '@/domain/entities/patient.entity';

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly docRepository: IDoctorRepository,
  ) { }

  async execute(request: GetAllUsersRequest): Promise<GetAllUsersResponse> {
    this.validateRequest(request);

    const page = request.page ?? 1;
    const limit = request.limit ?? 10;
    const userType = request.userType ?? "patient";

    let users: any[] = [];
    let total = 0;

    if (userType == "patient") {
      ({ users, total } = await this.patientRepository.findAll(page, limit));
    } else if (userType == "doctor") {
      ({ users, total } = await this.docRepository.findAll(page, limit));
    }


    if (!users || users.length === 0) {
      throw new AppError('Users not found', 'USERS_NOT_FOUND', 404);
    }

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
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

  private validateRequest(request: GetAllUsersRequest): void {
    if (!request.userType || request.userType.trim() === '') {
      throw new AppError('User type is required', 'INVALID_INPUT', 400);
    }
  }
}
