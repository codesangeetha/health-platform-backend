// Response type for getting comprehensive prescription details including lab test orders and medicine orders
export interface GetPrescriptionDetailsResponse {
    success: boolean;
    message: string;
    timestamp: string;
    data: {
        prescription: {
            _id: string;
            appointmentId: string;
            doctorId: string;
            patientId: string;
            diagnosis: string;
            notes?: string;
            medicines: Array<{
                medicineId: string;
                name?: string;
                dosage: string;
                timing: string[];
                duration: number;
                mealTime: 'before meal' | 'after meal' | 'with meal';
            }>;
            tests?: string[];
            status: 'Created' | 'Dispensed' | 'Cancelled';
            createdAt: string;
            updatedAt: string;
        };
        labTestOrders: Array<{
            _id: string;
            orderId: string;
            orderType: string;
            prescriptionId: string;
            items: Array<{
                labTestId: string;
                name?: string;
                quantity: number;
                price: number;
                result: string | undefined;
            }>;
            deliveryAddress: {
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
            };
            collectionMethod: string;
            totalAmount: number;
            status: string;
            scheduledDate: string | undefined;
            patientId: string;
            createdAt: string;
            updatedAt: string;
            reason?: string;
        }>;
        medicineOrders: Array<{
            _id: string;
            orderId: string;
            orderType: string;
            prescriptionId: string;
            items: Array<{
                medicineId: string;
                name?: string;
                quantity: number;
                price: number;
            }>;
            deliveryAddress: {
                street: string;
                city: string;
                state: string;
                zipCode: string;
                country: string;
            };
            deliveryMethod: string;
            totalAmount: number;
            status: string;
            estimatedDelivery: string | undefined;
            patientId: string;
            createdAt: string;
            updatedAt: string;
        }>;
    };
}