export interface UpdatePatientProfileRequest {
     firstName: string,
     lastName: string,
     email: string,
     phone: string,
     whatsapp:string,
     bloodGroup: string | undefined;
     allergies: string[];
     chronicDiseases: string[];
     emergencyContact: {
         name: string;
         relationship: string;
         phone: string;
     } | undefined;
 }

export interface UpdatePatientProfileResponse {
    success: boolean;
    message: string;
    data: {
        patientId: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        whatsapp:string;
    };
    timestamp: string;
}

