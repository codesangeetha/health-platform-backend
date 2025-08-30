export const validDoctorRegistration = {
    userType: 'doctor' as const,
    email: 'dr.smith@example.com',
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1234567890',
    specialization: 'Cardiologist,general',
    licenseNumber: 'MED123456',
    experience: "16",
    consultationFee: 200,
    qualification: 'MD, MBBS',
    hospital: 'City General Hospital',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTime: {
        start: '09:00',
        end: '17:00'
    },
    rating: 0,
    totalPatients: 0
};


export const bodyData = {
    firstName: "John",
    lastName: "Smith",
    phone: "+1234567890",
    specialization: "Cardiologist,general",
    licenseNumber: "MED123456",
    experience: 16,
    consultationFee: 200,
    qualification: "MD, MBBS",
    hospital: "City General Hospital",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTime: {
        start: "09:00",
        end: "17:00"
    }
}
