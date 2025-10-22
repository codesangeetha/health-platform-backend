export const validPatientRegistration = {
    userType: 'patient' as const,
    email: 'patient@example.com',
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    dateOfBirth: '1990-01-01',
    bloodGroup: 'A+',
    allergies: ['Penicillin', 'Dust'],
    chronicDiseases: ['Diabetes'],
    emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1234567891'
    }
};


export const updateData = {
     firstName: "Karthik",
     lastName: "MC",
     email: "karthik@example.com",
     phone: "1234567890",
     whatsapp: "1234567891",
     bloodGroup: "O-",
     allergies: ["Dust mites"],
     chronicDiseases: ["Nill"],
     emergencyContact: {
         name: "Jane Doe",
         relationship: "Spouse",
         phone: "+1234567891"
     }
 }