import { IGoogleOAuthUseCase } from '@/domain/use-cases/interfaces/authentication/google-oauth.use-case.interface';
import { GoogleProfile } from '@/domain/types/authentication/google-oauth.type';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientModel } from '@/infrastructure/driven-adapters/database';

export class GoogleOAuthUseCase implements IGoogleOAuthUseCase {
  constructor(private readonly userRepository: UserRepositoryMongoDB) {}

  async authenticateWithGoogle(profile: GoogleProfile): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isActive: boolean;
    userType: 'patient' | 'doctor' | 'admin';
  }> {
    const email = profile.emails[0]?.value;

    if (!email) {
      throw new Error('No email found in Google profile');
    }

    // Check if user exists
    let user = await this.userRepository.findByEmail(email);

    if (user) {
      return {
        id: user._id || user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        isActive: user.isActive || true,
        userType: user.userType || 'patient',
      };
    }

    // Create new user from Google profile
    const newUserData = {
      email,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      phone: '',
      whatsapp: '',
      dateOfBirth: new Date(),
      isActive: true,
      googleId: profile.id,
      profilePicture: profile.photos[0]?.value,
      userType: 'patient' as const,
    };

    // Save user to database
    const savedUser = await PatientModel.create(newUserData);

    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      profilePicture: (savedUser as any).profilePicture,
      isActive: savedUser.isActive,
      userType: savedUser.userType,
    };
  }

  async getUserById(id: string): Promise<any> {
    return await this.userRepository.findById(id);
  }
}