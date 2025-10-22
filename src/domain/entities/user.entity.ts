export abstract class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly userType: 'patient' | 'doctor' | 'admin',
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly whatsapp: string,
    public readonly dateOfBirth: Date,
    public readonly isVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}
}