import { ICreateUserUseCase } from '../interfaces/admin/create-user.use-case.interface';
import { IUserRepository } from '../interfaces/authentication/user-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { hashPassword } from '@/shared/utils/helpers';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';
import { CreateUserRequest, CreateUserResponse } from '@/domain/types/admin/create-user.type';

export class CreateUserUseCase implements ICreateUserUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
        // Validate input
        this.validateCreateUserRequest(request);

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(request.email);
        if (existingUser) {
            throw new AppError('Email already exists', 'USER_003', 409);
        }

        // Hash password
        const hashedPassword = await hashPassword(request.password);

        let savedUser;
        if (request.userType === 'patient') {
            const patientData = {
                ...request,
                password: hashedPassword,
                isVerified: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            savedUser = await this.userRepository.create(patientData, PatientModel);
        } else {
            const doctorData = {
                ...request,
                password: hashedPassword,
                isVerified: false,
                rating: 0,
                totalPatients: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            savedUser = await this.userRepository.create(doctorData, DoctorModel);
        }

        return {
            success: true,
            message: 'User created successfully',
            timestamp: savedUser.createdAt,
            data: {
                userId: savedUser._id,
                email: savedUser.email,
                userType: savedUser.userType
            }
        };
    }

    private validateCreateUserRequest(request: CreateUserRequest): void {
        const commonFields = ['email', 'password', 'firstName', 'lastName', 'phone',  'userType'];
        for (const field of commonFields) {
            if (!request[field as keyof typeof request]) {
                throw new AppError(`Missing required field: ${field}`, 'USER_001', 400);
            }
        }

        if (!request.email.includes('@')) {
            throw new AppError('Invalid email format', 'USER_001', 400);
        }

        if (request.password.length < 8) {
            throw new AppError('Password must be at least 8 characters long', 'USER_001', 400);
        }

        if (request.userType === 'doctor') {
            const doctorRequest = request as CreateUserRequest;
            const doctorFields = ['specialization', 'licenseNumber', 'experience', 'consultationFee', 'qualification', 'hospital'];

            for (const field of doctorFields) {
                if (!doctorRequest[field as keyof typeof doctorRequest]) {
                    throw new AppError(`Missing required doctor field: ${field}`, 'USER_001', 400);
                }
            }
        }

    }
}