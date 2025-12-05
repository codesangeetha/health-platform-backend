import { IGoogleOAuthUseCase } from '@/domain/use-cases/interfaces/authentication/google-oauth.use-case.interface';
import { GoogleProfile } from '@/domain/types/authentication/google-oauth.type';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { IEmailService } from '@/infrastructure/driven-adapters/email/email.service.interface';

export class GoogleOAuthUseCase implements IGoogleOAuthUseCase {
  constructor(
    private readonly userRepository: UserRepositoryMongoDB,
    private readonly emailService: IEmailService
  ) {}

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
      phone: '0000000000', // Default placeholder
      whatsapp: '0000000000', // Default placeholder
      dateOfBirth: new Date(),
      isActive: true,
      googleId: profile.id,
      profilePicture: profile.photos[0]?.value,
      userType: 'patient' as const,
    };

    // Save user to database
    const savedUser = await PatientModel.create(newUserData);

    // Send welcome email to new user
    const emailSubject = 'Welcome to Health Platform';
    const emailContent = `
      <html>
        <body>
          <h2>Welcome to Health Platform!</h2>
          <p>Dear ${savedUser.firstName},</p>
          <p>Thank you for registering with Health Platform. Your account has been successfully created.</p>
          <p>You can now login to access our services and manage your healthcare needs.</p>
          <br>
          <p><a href="https://health-platform-frontend.vercel.app/patient/login" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Login to Your Account</a></p>
          <br>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <br>
          <p>Best regards,</p>
          <p>Health Platform Team</p>
        </body>
      </html>
    `;

    try {
      await this.emailService.sendEmail(savedUser.email, emailSubject, emailContent);
      console.log('Welcome email sent successfully to:', savedUser.email);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }

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