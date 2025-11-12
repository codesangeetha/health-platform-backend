import { IPatientRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient-repository.interface';
import { AppError } from '@/shared/errors/app-error';
import { EditPatientByAdminRequest, EditPatientByAdminResponse } from '@/domain/types/admin/edit-patient-by-admin.type';
import { IEditPatientByAdminUseCase } from '../interfaces/admin/edit-patient-by-admin.use-case.interface';

export class EditPatientByAdminUseCase implements IEditPatientByAdminUseCase {
    constructor(
        private readonly patientRepository: IPatientRepository
    ) { }

    async execute(patientId: string, request: EditPatientByAdminRequest): Promise<EditPatientByAdminResponse> {
        // Validate input - at least one field should be provided for update
        this.validateRequest(request);

        // Check if patient exists
        const existingPatient = await this.patientRepository.findById(patientId);
        if (!existingPatient) {
            throw new AppError('Patient not found', 'PATIENT_NOT_FOUND', 404);
        }

        // Check for duplicate email, phone and whatsapp numbers (excluding current patient)
        await this.validateUniqueFields(patientId, request.email, request.phone, request.whatsapp);

        // Prepare update data - only include fields that are provided
        const updateData: any = {};
        const updatedFields: string[] = [];

        if (request.firstName !== undefined) {
            updateData.firstName = request.firstName;
            updatedFields.push('firstName');
        }
        if (request.lastName !== undefined) {
            updateData.lastName = request.lastName;
            updatedFields.push('lastName');
        }
        if (request.email !== undefined) {
            updateData.email = request.email;
            updatedFields.push('email');
        }
        if (request.phone !== undefined) {
            updateData.phone = request.phone;
            updatedFields.push('phone');
        }
        if (request.whatsapp !== undefined) {
            updateData.whatsapp = request.whatsapp;
            updatedFields.push('whatsapp');
        }
        if (request.bloodGroup !== undefined) {
            updateData.bloodGroup = request.bloodGroup;
            updatedFields.push('bloodGroup');
        }
        if (request.allergies !== undefined) {
            updateData.allergies = request.allergies;
            updatedFields.push('allergies');
        }
        if (request.chronicDiseases !== undefined) {
            updateData.chronicDiseases = request.chronicDiseases;
            updatedFields.push('chronicDiseases');
        }
        if (request.emergencyContact !== undefined) {
            updateData.emergencyContact = request.emergencyContact;
            updatedFields.push('emergencyContact');
        }

        // Update patient profile
        const updatedPatient = await this.patientRepository.updateByUserId(patientId, updateData);

        if (!updatedPatient) {
            throw new AppError('Failed to update patient profile', 'UPDATE_FAILED', 500);
        }

        // Return response
        return {
            success: true,
            message: 'Patient profile updated successfully',
            data: {
                patientId: updatedPatient.id,
                firstName: updatedPatient.firstName,
                lastName: updatedPatient.lastName,
                email: updatedPatient.email,
                phone: updatedPatient.phone,
                whatsapp: updatedPatient.whatsapp,
                updatedFields
            },
            timestamp: new Date().toISOString()
        };
    }

    private validateRequest(request: EditPatientByAdminRequest): void {
        // Check if at least one field is provided for update
        const hasValidFields = 
            request.firstName !== undefined ||
            request.lastName !== undefined ||
            request.email !== undefined ||
            request.phone !== undefined ||
            request.whatsapp !== undefined ||
            request.bloodGroup !== undefined ||
            request.allergies !== undefined ||
            request.chronicDiseases !== undefined ||
            request.emergencyContact !== undefined;

        if (!hasValidFields) {
            throw new AppError('At least one field must be provided for update', 'NO_UPDATE_FIELDS', 400);
        }
    }

    private async validateUniqueFields(patientId: string, email?: string, phone?: string, whatsapp?: string): Promise<void> {
        // Check for duplicate email
        if (email) {
            const existingPatientByEmail = await this.patientRepository.findByEmail(email);
            if (existingPatientByEmail && existingPatientByEmail.id.toString() !== patientId.toString()) {
                throw new AppError('Email is already registered to another patient', 'EMAIL_ALREADY_EXISTS', 409);
            }
        }

        // Check for duplicate phone number
        if (phone) {
            const existingPatientByPhone = await this.patientRepository.findByPhone(phone);
            if (existingPatientByPhone && existingPatientByPhone.id.toString() !== patientId.toString()) {
                throw new AppError('Phone number is already registered to another patient', 'PHONE_ALREADY_EXISTS', 409);
            }
        }

        // Check for duplicate whatsapp number
        if (whatsapp) {
            const existingPatientByWhatsapp = await this.patientRepository.findByWhatsapp(whatsapp);
            if (existingPatientByWhatsapp && existingPatientByWhatsapp.id.toString() !== patientId.toString()) {
                throw new AppError('WhatsApp number is already registered to another patient', 'WHATSAPP_ALREADY_EXISTS', 409);
            }
        }
    }
}