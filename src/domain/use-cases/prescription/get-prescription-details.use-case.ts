import { AppError } from '@/shared/errors/app-error';
import { IGetPrescriptionDetailsUseCase } from '../interfaces/prescription/get-prescription-details.use-case.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';
import { ILabTestOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository.interface';
import { IMedicineOrderRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository.interface';
import { IMedicineRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository.interface';
import { ILabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository.interface';
import { GetPrescriptionDetailsResponse } from '@/domain/types/prescription/get-prescription-details.type';

export class GetPrescriptionDetailsUseCase implements IGetPrescriptionDetailsUseCase {
    constructor(
        private readonly prescriptionRepository: IPrescriptionRepository,
        private readonly labTestOrderRepository: ILabTestOrderRepository,
        private readonly medicineOrderRepository: IMedicineOrderRepository,
        private readonly medicineRepository: IMedicineRepository,
        private readonly labTestRepository: ILabTestRepository
    ) { }

    async execute(appointmentId: string): Promise<GetPrescriptionDetailsResponse> {
        // Validate input
        if (!appointmentId) {
            throw new AppError('Appointment ID is required', 'PRESCRIPTION_DETAILS_001', 400);
        }

        // Get prescription by appointment ID
        const prescription = await this.prescriptionRepository.findByAppointmentId(appointmentId);

        if (!prescription) {
            throw new AppError('Prescription not found for this appointment', 'PRESCRIPTION_DETAILS_002', 404);
        }

        // Get lab test orders for this prescription
        const labTestOrders = await this.labTestOrderRepository.findByPrescriptionId(prescription.id);

        // Get medicine orders for this prescription
        const medicineOrders = await this.medicineOrderRepository.findByPrescriptionId(prescription.id);

        // Helper function to get medicine names
        const getMedicineName = async (medicineId: string): Promise<string | undefined> => {
            try {
                const medicine = await this.medicineRepository.findById(medicineId);
                return medicine?.name;
            } catch {
                return undefined;
            }
        };

        // Helper function to get lab test names
        const getLabTestName = async (labTestId: string): Promise<string | undefined> => {
            try {
                const labTest = await this.labTestRepository.findById(labTestId);
                return labTest?.name;
            } catch {
                return undefined;
            }
        };

        // Format lab test orders for response with names
        const formattedLabTestOrders = await Promise.all(labTestOrders.map(async (order) => ({
            _id: order.id,
            orderId: order.orderId,
            orderType: order.orderType,
            prescriptionId: order.prescriptionId || '',
            items: await Promise.all(order.items.map(async (item) => {
                const labTestName = await getLabTestName(item.labTestId || '');
                return {
                    labTestId: item.labTestId || '',
                    ...(labTestName && { name: labTestName }),
                    quantity: item.quantity,
                    price: item.price || 0,
                    result: item.result || undefined
                };
            })),
            deliveryAddress: order.deliveryAddress,
            collectionMethod: order.collectionMethod,
            totalAmount: order.totalAmount,
            status: order.status,
            scheduledDate: order.scheduledDate?.toISOString(),
            patientId: order.patientId || order.userId || '',
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            ...(order.reason && { reason: order.reason })
        })));

        // Format medicine orders for response with names
        const formattedMedicineOrders = await Promise.all(medicineOrders.map(async (order) => ({
            _id: order.id,
            orderId: order.orderId,
            orderType: order.orderType,
            prescriptionId: order.prescriptionId || '',
            items: await Promise.all(order.items.map(async (item) => {
                const medicineName = await getMedicineName(item.medicineId || '');
                return {
                    medicineId: item.medicineId || '',
                    ...(medicineName && { name: medicineName }),
                    quantity: item.quantity,
                    price: item.price || 0
                };
            })),
            deliveryAddress: order.deliveryAddress,
            deliveryMethod: order.deliveryMethod,
            totalAmount: order.totalAmount,
            status: order.status,
            estimatedDelivery: order.estimatedDelivery?.toISOString(),
            patientId: order.patientId || order.userId || '',
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString()
        })));

        // Enrich prescription medicines with names
        const enrichedMedicines = await Promise.all(
            prescription.medicines.map(async (medicine) => {
                const medicineName = await getMedicineName(medicine.medicineId || '');
                return {
                    ...medicine,
                    ...(medicineName && { name: medicineName })
                };
            })
        );

        return {
            success: true,
            message: 'Prescription details retrieved successfully',
            timestamp: new Date().toISOString(),
            data: {
                prescription: {
                    _id: prescription.id,
                    appointmentId: prescription.appointmentId,
                    doctorId: prescription.doctorId,
                    patientId: prescription.patientId,
                    diagnosis: prescription.diagnosis,
                    ...(prescription.notes && { notes: prescription.notes }),
                    medicines: enrichedMedicines,
                    ...(prescription.tests && { tests: prescription.tests }),
                    status: prescription.status,
                    createdAt: prescription.createdAt.toISOString(),
                    updatedAt: prescription.updatedAt.toISOString()
                },
                labTestOrders: formattedLabTestOrders,
                medicineOrders: formattedMedicineOrders
            }
        };
    }
}