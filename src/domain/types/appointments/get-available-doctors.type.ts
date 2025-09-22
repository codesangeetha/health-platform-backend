import { Doctor } from "@/domain/entities/doctor.entity";

export interface GetAvailableDoctorsRequest {
    page?: number;
    limit?: number;
    specialization: string;
    availableDays?:string[];
}

// Response type
export interface GetAvailableDoctorsResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    doctors: Doctor[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

