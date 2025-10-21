// src/application/controllers/pharmacyAdmin/order-medicine.controller.ts
import { Request, Response } from 'express';
import { AppError } from '@/shared/errors/app-error';
import { IOrderMedicineUseCase } from '@/domain/use-cases/interfaces/pharmacyAdmin/order-medicine.use-case.interface';
import { IOrderMedicineController } from '../interfaces/pharmacyAdmin/order-medicine.controller.interface';
import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { IPrescriptionRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository.interface';

export class OrderMedicineController implements IOrderMedicineController {
    constructor(
        private readonly orderMedicineUseCase: IOrderMedicineUseCase,
        private readonly patientRepository: IPatientRepository,
        private readonly prescriptionRepository: IPrescriptionRepository
    ) { }

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Extract request data
            const { prescriptionId, items, deliveryAddress, deliveryMethod } = req.body;

            // Validate required fields
            if (!prescriptionId || !items || !deliveryMethod) {
                throw new AppError('Missing required fields: prescriptionId, items, and deliveryMethod are required', 'ORDER_FIELDS_REQUIRED', 400);
            }

            // Get patient ID from prescription instead of authenticated user
            let patientId: string;
            try {
                const prescription = await this.prescriptionRepository.findById(prescriptionId);
                if (prescription) {
                    patientId = prescription.patientId; //Correct source from prescription
                    console.log('Found correct patientId from prescription:', patientId);
                } else {
                    throw new AppError('Prescription not found. Please provide a valid prescription ID.', 'PRESCRIPTION_NOT_FOUND', 404);
                }
            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                throw new AppError('Unable to retrieve prescription information.', 'PRESCRIPTION_INFO_ERROR', 400);
            }

            // Get patient information for default address if needed
            let finalDeliveryAddress = deliveryAddress;
            if (!deliveryAddress) {
                try {
                    const patient = await this.patientRepository.findByUserId(patientId);
                    if (patient) {
                        // Create a basic delivery address from patient info
                        // Note: This is a temporary solution until proper address fields are added to patient schema
                        finalDeliveryAddress = {
                            street: `${patient.firstName} ${patient.lastName}'s Address`,
                            city: 'Please Update',
                            state: 'Please Update',
                            zipCode: '00000',
                            country: 'Please Update'
                        };
                    } else {
                        throw new AppError('Patient profile not found. Please update your profile or provide a delivery address.', 'PATIENT_PROFILE_NOT_FOUND', 404);
                    }
                } catch (error) {
                    throw new AppError('Unable to retrieve patient information. Please provide a delivery address.', 'PATIENT_INFO_ERROR', 400);
                }
            }

            // Validate delivery address if provided
            if (finalDeliveryAddress) {
                const addressFields = ['street', 'city', 'state', 'zipCode', 'country'];
                for (const field of addressFields) {
                    if (!finalDeliveryAddress[field as keyof typeof finalDeliveryAddress]) {
                        throw new AppError(`Missing required delivery address field: ${field}`, 'ORDER_003', 400);
                    }
                }
            }

            // Execute use case
            const result = await this.orderMedicineUseCase.execute({
                prescriptionId,
                patientId,
                items,
                deliveryAddress: finalDeliveryAddress,
                deliveryMethod
            });

            res.status(201).json(result);

        } catch (error) {
            if (error instanceof AppError) {
                console.log('AppError caught:', {
                    message: error.message,
                    errorCode: error.errorCode,
                    statusCode: error.statusCode
                });

                res.status(error.statusCode).json({
                    success: false,
                    message: error.message,
                    error: error.errorCode
                });
            } else {
                console.log('Non-AppError caught, sending generic 500 response');

                res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                    error: 'INTERNAL_SERVER_ERROR'
                });
            }
        }
    }
}