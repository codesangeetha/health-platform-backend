export type MedicineStatus = 'active' | 'inactive';

export interface PharmacyMedicineRequest {
  name: string;
  genericName: string;
  category: string; // can be ObjectId later if linked to PharmacyCategory
  manufacturer: string;
  price: number;
  stock: number;
  description?: string;
  dosage?: string;
  sideEffects?: string[];
  interactions?: string[];
  ingredients?: string[];
  storage?: string;
  expiryDate: string; // ISO date string
  status: MedicineStatus;
}

export interface PharmacyMedicineResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    medicineId: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: MedicineStatus;
    createdAt: string;
  };
}
