import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient.repository';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { BrevoEmailService } from '@/infrastructure/driven-adapters/email/brevo-email.service';
import { MailtrapEmailService } from '@/infrastructure/driven-adapters/email/mailtrap-email.service';

export class PassportConfig {
  private userRepository: UserRepositoryMongoDB;
  private patientRepository: PatientRepositoryMongoDB;
  private emailService: BrevoEmailService | MailtrapEmailService;

  constructor() {
    this.userRepository = new UserRepositoryMongoDB();
    this.patientRepository = new PatientRepositoryMongoDB(PatientModel);
    // Use Brevo service for production or Mailtrap for development
    this.emailService = new BrevoEmailService(process.env.BREVO_API_KEY || 'dummy-key');
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    // Google OAuth Strategy
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
        },
        async (accessToken, refreshToken, profile: Profile, done) => {
          try {
            console.log('🔐 Google OAuth strategy initiated');
            console.log('📧 Profile email:', profile.emails?.[0]?.value);
            console.log('👤 Profile name:', profile.name);
            console.log('🆔 Profile ID:', profile.id);

            const email = profile.emails?.[0]?.value;
            if (!email) {
              console.error('❌ No email found in Google profile');
              return done(new Error('No email found in Google profile'), false);
            }

            console.log('🔍 Checking if user exists...');
            // Check if user exists by email or Google ID
            let user = await this.userRepository.findByEmail(email) || await this.userRepository.findByGoogleId(profile.id);

            if (user) {
              console.log('✅ Existing user found:', user.email);
              // User exists, return user
              return done(null, user);
            }

            console.log('🆕 Creating new user from Google profile...');
            // Create new user from Google profile
            const newUserData = {
              email,
              firstName: profile.name?.givenName || '',
              lastName: profile.name?.familyName || '',
              phone: '0000000000', // Default phone for OAuth users
              whatsapp: '0000000000', // Default WhatsApp for OAuth users
              dateOfBirth: new Date(), // Default date, should be updated by user
              isActive: true, // Google accounts are pre-verified
              userType: 'patient', // Default to patient for OAuth users
              googleId: profile.id,
              profilePicture: profile.photos?.[0]?.value,
            };

            console.log('💾 Saving user to database...');
            // Save user to PatientModel directly
            const savedUser = await PatientModel.create(newUserData);
            console.log('✅ New user created successfully:', savedUser.email);

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
              console.log('📧 Welcome email sent successfully to:', savedUser.email);
            } catch (error) {
              console.error('❌ Failed to send welcome email:', error);
            }

            return done(null, savedUser.toObject());
          } catch (error) {
            console.error('💥 Google OAuth strategy error:', error);
            return done(error, false);
          }
        }
      )
    );

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
      done(null, user._id || user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await this.userRepository.findById(id);
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  public getPassport(): typeof passport {
    return passport;
  }
}