// Request body type
export interface UpdateUserStatusRequest {
    isActive: true | false;
};

// Response type
export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    timestamp: string; // ISO date string
    data: {
        userId: string;
        isActive: true | false;
    };
};
    