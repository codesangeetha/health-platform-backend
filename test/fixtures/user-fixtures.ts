export const validUserRegistration = {
  userType: 'patient' as const,
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  bloodGroup: 'O+',
  allergies: [],
  chronicDiseases: [],
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1234567891'
  }
};

export const invalidUserRegistration = {
  userType: 'patient' as const,
  email: 'invalid-email',
  password: 'weak',
  firstName: '',
  lastName: 'Doe',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01'
};

export const duplicateUserRegistration = {
  userType: 'patient' as const,
  email: 'duplicate@example.com',
  password: 'TestPassword123!',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01'
};

export const validLoginRequest = {
  email: 'test@example.com',
  password: 'TestPassword123!'
};

export const invalidLoginRequest = {
  email: 'test@example.com',
  password: 'WrongPassword123!'
};