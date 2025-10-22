// Request body type
export interface UpdateUserStatusRequest {
    isVerified: true | false;
};

// Response type
export interface UpdateUserStatusResponse {
    success: boolean;
    message: string;
    timestamp: string; // ISO date string
    data: {
        userId: string;
        isVerified: true | false;
    };
};
    