import { GetLabTestDashboardCountsRequest, GetLabTestDashboardCountsResponse } from '@/domain/types/labTestAdmin/get-lab-test-dashboard-counts.type';
import { IGetLabTestDashboardCountsUseCase } from '../interfaces/labTestAdmin/get-lab-test-dashboard-counts.use-case.interface';
import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';

export class GetLabTestDashboardCountsUseCase implements IGetLabTestDashboardCountsUseCase {
  constructor(
    private readonly labTestRepository: ILabTestRepository,
    private readonly labTestOrderRepository: ILabTestOrderRepository
  ) {}

  async execute(request: GetLabTestDashboardCountsRequest): Promise<GetLabTestDashboardCountsResponse> {
    try {
      // Get total lab test count
      const totalLabTests = await this.labTestRepository.count({});

      // Get total lab test order count (lab test orders only)
      // Using findAll with limit 1 to get total count since there's no direct count method
      const { total: totalLabTestOrders } = await this.labTestOrderRepository.findAll(1, 1);

      return {
        success: true,
        data: {
          totalLabTests,
          totalLabTestOrders
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting lab test dashboard counts:', error);
      throw error;
    }
  }
}
