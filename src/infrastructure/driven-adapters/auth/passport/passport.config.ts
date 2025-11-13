import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient.repository';
import { PatientModel } from '@/infrastructure/driven-adapters/database';

export class PassportConfig {
  private userRepository: UserRepositoryMongoDB;
  private patientRepository: PatientRepositoryMongoDB;

  constructor() {
    this.userRepository = new UserRepositoryMongoDB();
    this.patientRepository = new PatientRepositoryMongoDB(PatientModel);
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