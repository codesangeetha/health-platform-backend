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

export const minimalPatientData = {
  userType: 'patient' as const,
  email: 'minimal@example.com',
  password: 'TestPassword123!',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1234567892',
  dateOfBirth: '1985-05-15'
};

export const patientWithAllergiesOnly = {
  userType: 'patient' as const,
  email: 'allergies@example.com',
  password: 'TestPassword123!',
  firstName: 'Bob',
  lastName: 'Johnson',
  phone: '+1234567893',
  dateOfBirth: '1992-08-20',
  allergies: ['Peanuts', 'Shellfish']
};

export const patientWithChronicDiseasesOnly = {
  userType: 'patient' as const,
  email: 'chronic@example.com',
  password: 'TestPassword123!',
  firstName: 'Alice',
  lastName: 'Brown',
  phone: '+1234567894',
  dateOfBirth: '1988-12-10',
  chronicDiseases: ['Hypertension', 'Asthma']
};

export const patientWithEmergencyContactOnly = {
  userType: 'patient' as const,
  email: 'emergency@example.com',
  password: 'TestPassword123!',
  firstName: 'Charlie',
  lastName: 'Wilson',
  phone: '+1234567895',
  dateOfBirth: '1995-03-25',
  emergencyContact: {
    name: 'David Wilson',
    relationship: 'Father',
    phone: '+1234567896'
  }
};