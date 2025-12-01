import { GetPharmacyDashboardCountsRequest, GetPharmacyDashboardCountsResponse } from '@/domain/types/pharmacyAdmin/get-pharmacy-dashboard-counts.type';
import { IGetPharmacyDashboardCountsUseCase } from '../interfaces/pharmacyAdmin/get-pharmacy-dashboard-counts.use-case.interface';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';

export class GetPharmacyDashboardCountsUseCase implements IGetPharmacyDashboardCountsUseCase {
  constructor(
    private readonly medicineRepository: IMedicineRepository,
    private readonly medicineOrderRepository: IMedicineOrderRepository
  ) {}

  async execute(request: GetPharmacyDashboardCountsRequest): Promise<GetPharmacyDashboardCountsResponse> {
    try {
      // Get total medicine count
      const totalMedicines = await this.medicineRepository.count();

      // Get total pharmacy order count (medicine orders only)
      // Since there's no count method in the repository interface yet, we'll use findAll with limit 1 to get total count
      const { total: totalOrders } = await this.medicineOrderRepository.findAll(1, 1);

      return {
        success: true,
        data: {
          totalMedicines,
          totalOrders
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting pharmacy dashboard counts:', error);
      throw error;
    }
  }
}