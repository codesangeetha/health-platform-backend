import { Patient } from "@/domain/entities/patient.entity";

// Request type (Admin only, can include pagination/filter if needed)
export interface GetAllUsersRequest {
  page?: number;
  limit?: number;
  userType :'patient' | 'doctor' | 'admin';
  firstname?: string; // optional filter for first name
  lastname?: string; // optional filter for last name
}

// Response type
export interface GetAllUsersResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    users: Patient[];
    /* {
      userId: string;
      email: string;
      userType: 'patient' | 'doctor' | 'admin'; // adjust if you have fixed roles
      firstName: string;
      lastName: string;
      status: 'active' | 'inactive' | 'blocked'; // adjust if you have more statuses
      createdAt: string;
    } */
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
