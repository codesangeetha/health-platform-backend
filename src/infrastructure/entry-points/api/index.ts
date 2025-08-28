import express from 'express';
import { connectToDatabase } from '@/infrastructure/config/database/mongodb.config';
import { RegisterUserController } from '@/application/controllers/authentication/register-user.controller';
import { RegisterUserUseCase } from '@/domain/use-cases/authentication/register-user.use-case';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { PatientModel } from '@/infrastructure/driven-adapters/database';
import { AuthRoute } from './routes/auth.route';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import { LoginUserController } from '@/application/controllers/authentication/login-user.controller';
import { LoginUserUseCase } from '@/domain/use-cases/authentication/login-user.use-case';
import { ForgotPasswordController } from '@/application/controllers/authentication/forgot-password.controller';
import { ForgotPasswordUseCase } from '@/domain/use-cases/authentication/forgot-password.use-case';
import { MailtrapEmailService } from '@/infrastructure/driven-adapters/email/mailtrap-email.service';
import { ResetPasswordController } from '@/application/controllers/authentication/reset-password.controller';
import { ResetPasswordUseCase } from '@/domain/use-cases/authentication/reset-password.use-case';


import { PatientRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient.repository';
import { GetPatientProfileUseCase } from '@/domain/use-cases/patient/get-patient-profile.use-case';
import { GetPatientProfileController } from '@/application/controllers/patient/get-patient-profile.controller';
import { PatientRoute } from './routes/patient.route';
import { AppError } from '@/shared/errors/app-error';
import { UpdatePatientProfileUseCase } from '@/domain/use-cases/patient/update-patient-profile.use-case';
import { UpdatePatientProfileController } from '@/application/controllers/patient/update-patient-profile.controller';


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
const connectDB = async () => {
  try {
    await connectToDatabase();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Setup dependencies
const setupDependencies = () => {
  // Database repositories
  const userRepository = new UserRepositoryMongoDB(PatientModel);
  const patientRepository = new PatientRepositoryMongoDB(PatientModel);

  const jwtService = new JwtService(
    process.env.JWT_SECRET || 'default-secret',
    process.env.JWT_EXPIRES_IN || '24h'
  );

  // Email Service - Only token is needed
  const emailService = new MailtrapEmailService(
    process.env.MAILTRAP_TOKEN || 'your-mailtrap-token'
  );

  // Use cases
  const registerUserUseCase = new RegisterUserUseCase(userRepository);
  const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
  const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, jwtService, emailService);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, jwtService);

  //patient use case
  const getPatientProfileUseCase = new GetPatientProfileUseCase(patientRepository);
  const updatePatientProfileUseCase = new UpdatePatientProfileUseCase(patientRepository);

  // Controllers
  const registerUserController = new RegisterUserController(registerUserUseCase);
  const loginUserController = new LoginUserController(loginUserUseCase);
  const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);
  const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

  // Patient Controllers
  const getPatientProfileController = new GetPatientProfileController(getPatientProfileUseCase);
  const updatePatientProfileController = new UpdatePatientProfileController(updatePatientProfileUseCase);
  const patientRoute = new PatientRoute(getPatientProfileController, updatePatientProfileController);

  // Routes
  const authRoute = new AuthRoute(registerUserController, loginUserController, forgotPasswordController, resetPasswordController);

  return {
    authRoute,
    patientRoute
  };
};

// Setup routes
const setupRoutes = () => {
  const { authRoute, patientRoute } = setupDependencies();

  app.use('/api/v1', authRoute.router);
  app.use('/api/v1', patientRoute.router);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
};

// Start server
const startServer = () => {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Initialize application
const initializeApp = async () => {
  try {
    await connectDB();
    setupRoutes();
    startServer();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Start the application
initializeApp();

export default app;