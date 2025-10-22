import { UploadPrescriptionRequest, UploadPrescriptionResponse } from '@/domain/types/pharmacyAdmin/upload-prescription.type';

export interface IUploadPrescriptionUseCase {
    execute(request: UploadPrescriptionRequest): Promise<UploadPrescriptionResponse>
}
