import { IInstagramOAuthUseCase } from '@/domain/use-cases/interfaces/authentication/instagram-oauth.use-case.interface';
import { InstagramProfile, InstagramUserProfile } from '@/domain/types/authentication/instagram-oauth.type';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientModel, DoctorModel } from '@/infrastructure/driven-adapters/database';
import axios from 'axios';

export class InstagramOAuthUseCase implements IInstagramOAuthUseCase {
  constructor(private readonly userRepository: UserRepositoryMongoDB) {}

  async authenticateWithInstagram(code: string): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isActive: boolean;
    userType: 'patient' | 'doctor' | 'admin';
  }> {
    console.log('📸 Starting Instagram OAuth authentication process');
    
    // Step 1: Exchange authorization code for access token
    const accessToken = await this.exchangeCodeForToken(code);
    console.log('🔑 Access token received from Instagram');

    // Step 2: Fetch user profile from Instagram Graph API
    const instagramProfile = await this.fetchInstagramProfile(accessToken);
    console.log('👤 Instagram profile fetched:', {
      id: instagramProfile.id,
      username: instagramProfile.username
    });

    // Step 3: Find existing user by Instagram ID (custom search)
    let user = await this.findByInstagramId(instagramProfile.id);
    
    if (!user) {
      // Try to find by username as fallback
      user = await this.findByUsername(instagramProfile.username);
    }

    if (user) {
      console.log('✅ Existing user found, updating Instagram ID if needed');
      
      // Update the user's Instagram ID if it wasn't set before
      if (!user.instagramId) {
        await this.updateUserInstagramId(user._id.toString(), instagramProfile.id);
      }
      
      return {
        id: user._id || user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || '',
        profilePicture: user.profilePicture || instagramProfile.profile_picture_url,
        isActive: user.isActive || true,
        userType: user.userType || 'patient',
      };
    }

    // Step 4: Create new user from Instagram profile
    console.log('🆕 Creating new user from Instagram profile');
    
    // Generate a placeholder email since Instagram doesn't always provide email
    const generatedEmail = `${instagramProfile.id}@instagram.local`;
    
    // Split username for firstName and lastName
    const usernameParts = instagramProfile.username.split('.');
    const firstName = usernameParts[0] || instagramProfile.username;
    const lastName = usernameParts.slice(1).join('.') || '';
    
    const newUserData = {
      email: generatedEmail,
      username: instagramProfile.username,
      firstName: firstName,
      lastName: lastName,
      phone: '0000000000', // Default placeholder
      whatsapp: '0000000000', // Default placeholder
      dateOfBirth: new Date(),
      isActive: true,
      instagramId: instagramProfile.id,
      profilePicture: instagramProfile.profile_picture_url,
      userType: 'patient' as const,
    };

    // Save user to database
    const savedUser = await PatientModel.create(newUserData);

    return {
      id: savedUser._id.toString(),
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName || '',
      profilePicture: savedUser.profilePicture || instagramProfile.profile_picture_url,
      isActive: savedUser.isActive,
      userType: savedUser.userType,
    };
  }

  async exchangeCodeForToken(code: string): Promise<string> {
    console.log('🔄 Exchanging authorization code for access token');
    
    const clientId = process.env.INSTAGRAM_APP_ID;
    const clientSecret = process.env.INSTAGRAM_APP_SECRET;
    const redirectUri = process.env.INSTAGRAM_CALLBACK_URL;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Instagram OAuth configuration is missing');
    }

    try {
      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
          code: code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('✅ Token exchange successful');
      return response.data.access_token;
    } catch (error: any) {
      console.error('❌ Error exchanging code for token:', error.response?.data || error.message);
      
      if (error.response?.data?.error_description) {
        throw new Error(`Instagram OAuth error: ${error.response.data.error_description}`);
      }
      
      throw new Error('Failed to exchange authorization code for access token');
    }
  }

  async fetchInstagramProfile(accessToken: string): Promise<InstagramProfile> {
    console.log('📋 Fetching Instagram user profile');
    
    try {
      const response = await axios.get(
        'https://graph.instagram.com/me',
        {
          params: {
            fields: 'id,username,profile_picture_url',
            access_token: accessToken,
          },
        }
      );

      console.log('✅ Instagram profile fetched successfully');
      return {
        id: response.data.id,
        username: response.data.username,
        profile_picture_url: response.data.profile_picture_url,
        access_token: accessToken,
      };
    } catch (error: any) {
      console.error('❌ Error fetching Instagram profile:', error.response?.data || error.message);
      
      if (error.response?.data?.error?.message) {
        throw new Error(`Instagram API error: ${error.response.data.error.message}`);
      }
      
      throw new Error('Failed to fetch Instagram profile');
    }
  }

  async getUserById(id: string): Promise<any> {
    return await this.userRepository.findById(id);
  }

  // Helper methods to work with existing repository
  private async findByInstagramId(instagramId: string): Promise<any> {
    // Search in both Patient and Doctor models
    const patient = await PatientModel.findOne({ instagramId }).lean();
    if (patient) return patient;

    const doctor = await DoctorModel.findOne({ instagramId }).lean();
    return doctor;
  }

  private async findByUsername(username: string): Promise<any> {
    // Search in both Patient and Doctor models
    const patient = await PatientModel.findOne({ username }).lean();
    if (patient) return patient;

    const doctor = await DoctorModel.findOne({ username }).lean();
    return doctor;
  }

  private async updateUserInstagramId(userId: string, instagramId: string): Promise<void> {
    // Try updating in both collections
    const patientUpdate = await PatientModel.findByIdAndUpdate(
      userId,
      {
        instagramId: instagramId,
        updatedAt: new Date()
      }
    );

    if (!patientUpdate) {
      // If not found in patients, try doctors
      await DoctorModel.findByIdAndUpdate(
        userId,
        {
          instagramId: instagramId,
          updatedAt: new Date()
        }
      );
    }
  }
}