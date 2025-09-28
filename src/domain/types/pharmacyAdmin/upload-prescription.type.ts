export interface UploadPrescriptionRequest {
  fileName: string;
  doctorId: string;
  notes?: string;
}

export interface UploadPrescriptionResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    prescriptionId: string;
    fileName: string;
    doctorId: string;
    uploadDate: string;
    createdAt: string;
  };
}