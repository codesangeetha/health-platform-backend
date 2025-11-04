import { IGetDashboardCountsUseCase } from '../interfaces/admin/get-dashboard-counts.use-case.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { IDoctorRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository.interface';
import { IAppointmentRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository.interface';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { IPharmacyCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository.interface';
import { ILabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository.interface';
import { GetDashboardCountsRequest, GetDashboardCountsResponse } from '@/domain/types/admin/dashboard-counts.type';
import { AppError } from '@/shared/errors/app-error';

export class GetDashboardCountsUseCase implements IGetDashboardCountsUseCase {
  constructor(
    private readonly patientRepository: IPatientRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly medicineRepository: IMedicineRepository,
    private readonly labTestRepository: ILabTestRepository,
    private readonly pharmacyCategoryRepository: IPharmacyCategoryRepository,
    private readonly labTestCategoryRepository: ILabTestCategoryRepository
  ) {}

  async execute(request: GetDashboardCountsRequest): Promise<GetDashboardCountsResponse> {
    try {
      // Get counts in parallel for better performance
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalMedicines,
        totalLabTests,
        totalPharmacyCategories,
        totalLabTestCategories
      ] = await Promise.all([
        this.patientRepository.count(),
        this.doctorRepository.count(),
        this.appointmentRepository.count(),
        this.medicineRepository.count(),
        this.labTestRepository.count({}),
        this.pharmacyCategoryRepository.count(),
        this.labTestCategoryRepository.count({})
      ]);

      return {
        success: true,
        message: 'Dashboard counts retrieved successfully',
        data: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalMedicines,
          totalLabTests,
          totalPharmacyCategories,
          totalLabTestCategories
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new AppError('Failed to retrieve dashboard counts', 'DATABASE_ERROR', 500);
    }
  }
}