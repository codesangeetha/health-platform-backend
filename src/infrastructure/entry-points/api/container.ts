import { RegisterUserController } from '@/application/controllers/authentication/register-user.controller';
import { RegisterUserUseCase } from '@/domain/use-cases/authentication/register-user.use-case';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { AppointmentModel, PatientModel, DoctorModel, PharmacyCategoryModel, MedicineModel, PrescriptionModel } from '@/infrastructure/driven-adapters/database';
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
import { UpdatePatientProfileUseCase } from '@/domain/use-cases/patient/update-patient-profile.use-case';
import { UpdatePatientProfileController } from '@/application/controllers/patient/update-patient-profile.controller';

import { GetDoctorProfileUseCase } from '@/domain/use-cases/doctor/get-doctor-profile.use-case';
import { GetDoctorProfileController } from '@/application/controllers/doctor/get-doctor-profile.controller';
import { DoctorRoute } from './routes/doctor.route';
import { DoctorRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository';
import { UpdateDoctorProfileUseCase } from '@/domain/use-cases/doctor/update-doctor-profile.use-case';
import { UpdateDoctorProfileController } from '@/application/controllers/doctor/update-doctor-profile.controller';

import { GetAllUsersController } from '@/application/controllers/admin/get-all-users.controller';
import { GetAllUsersUseCase } from '@/domain/use-cases/admin/get-all-users.use-case';
import { AdminRoute } from './routes/admin.route';
import { CreateUserController } from '@/application/controllers/admin/create-user.controller';
import { CreateUserUseCase } from '@/domain/use-cases/admin/create-user.use-case';
import { UpdateUserStatusController } from '@/application/controllers/admin/update-user-status.controller';
import { UpdateUserStatusUseCase } from '@/domain/use-cases/admin/update-user-status.use-case';

import { GetAvailableDoctorsUsecase } from '@/domain/use-cases/appointments/get-available-doctors.use-case';
import { GetAvailableDoctorsController } from '@/application/controllers/appointments/get-available-doctors.controller';
import { AppointmentRoute } from './routes/appointment';
import { BookAppointmentUseCase } from '@/domain/use-cases/appointments/book-appointment.use-case';
import { BookAppointmentController } from '@/application/controllers/appointments/book-appointment.controller';
import { AppointmentRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/appointment-repository';
import { GetPatientAppointmentsController } from '@/application/controllers/appointments/get-patient-appointments.controller';
import { GetPatientAppointmentsUseCase } from '@/domain/use-cases/appointments/get-patient-appointments.use-case';
import { RescheduleAppointmentController } from '@/application/controllers/appointments/reschedule-appointment.controller';
import { RescheduleAppointmentUseCase } from '@/domain/use-cases/appointments/reschedule-appointment.use-case';
import { UpdateAppointmentStatusController } from '@/application/controllers/appointments/update-appointment-status.controller';
import { UpdateAppointmentStatusUseCase } from '@/domain/use-cases/appointments/update-appointment-status.use-case';
import { GetDoctorAppointmentsController } from '@/application/controllers/appointments/get-doctor-appointments.controller';
import { GetDoctorAppointmentsUseCase } from '@/domain/use-cases/appointments/get-doctor-appointments.use-case';
import { GetAppointmentDetailsUseCase } from '@/domain/use-cases/appointments/get-appointment-details.use-case';
import { GetAppointmentDetailsController } from '@/application/controllers/appointments/get-appointment-details.controller';
import { GetDoctorDetailsUseCase } from '@/domain/use-cases/appointments/get-doctor-details.use-case';
import { GetDoctorDetailsController } from '@/application/controllers/appointments/get-doctor-details.controller';



import { AddMedCategoryUseCase } from '@/domain/use-cases/pharmacyAdmin/add-med-category.use-case';
import { PharmacyCategoryRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/pharmacyCategory-repository';
import { AddMedCategoryController } from '@/application/controllers/pharmacyAdmin/add-med-category.controller';
import { PharmacyAdminRoute } from './routes/pharmacyAdmin.route';
import { GetMedCategoryController } from '@/application/controllers/pharmacyAdmin/get-med-category.controller';
import { GetMedCategoryUseCase } from '@/domain/use-cases/pharmacyAdmin/get-med-category.use-case';
import { AddMedicineUsecase } from '@/domain/use-cases/pharmacyAdmin/add-medicine.use-case';
import { AddMedicineController } from '@/application/controllers/pharmacyAdmin/add-medicine.controller';
import { MedicineRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-repository';
import { GetMedicineController } from '@/application/controllers/pharmacyAdmin/get-medicine.controller';
import { GetMedicineUseCase } from '@/domain/use-cases/pharmacyAdmin/get-medicine.use-case';
import { PrescriptionRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/prescription-repository';
import { UploadPrescriptionUseCase } from '@/domain/use-cases/pharmacyAdmin/upload-prescription.use-case';
import { UploadPrescriptionController } from '@/application/controllers/pharmacyAdmin/upload-prescription.controller';

export interface Container {
    authRoute: AuthRoute;
    patientRoute: PatientRoute;
    doctorRoute: DoctorRoute;
    adminRoute: AdminRoute;
    appointmentRoute: AppointmentRoute;
    pharmacyAdminRoute: PharmacyAdminRoute;
}

export const setupDependencies = (): Container => {
    // Database repositories
    const userRepository = new UserRepositoryMongoDB();
    const patientRepository = new PatientRepositoryMongoDB(PatientModel);
    const doctorRepository = new DoctorRepositoryMongoDB(DoctorModel);
    const appointmentRepository = new AppointmentRepositoryMongoDB(AppointmentModel);
    const pharmacyCategoryRepository = new PharmacyCategoryRepositoryMongoDB(PharmacyCategoryModel);
    const pharmacyMedicineRepository = new MedicineRepositoryMongoDB(MedicineModel);
    const prescriptionRepository = new PrescriptionRepositoryMongoDB(PrescriptionModel);

    const jwtService = new JwtService(
        process.env.JWT_SECRET || 'default-secret',
        process.env.JWT_EXPIRES_IN || '24h'
    );

    const emailService = new MailtrapEmailService(
        process.env.MAILTRAP_TOKEN || 'your-mailtrap-token'
    );

    // Auth Use cases
    const registerUserUseCase = new RegisterUserUseCase(userRepository);
    const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
    const forgotPasswordUseCase = new ForgotPasswordUseCase(
        userRepository,
        jwtService,
        emailService
    );
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, jwtService);

    // Patient use cases
    const getPatientProfileUseCase = new GetPatientProfileUseCase(patientRepository);
    const updatePatientProfileUseCase = new UpdatePatientProfileUseCase(patientRepository);

    // Doctor use cases
    const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepository);
    const updateDoctorProfileUseCase = new UpdateDoctorProfileUseCase(doctorRepository);

    // Admin use cases
    const getAllUsersUseCase = new GetAllUsersUseCase(patientRepository, doctorRepository);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const updateUserStatusUseCase = new UpdateUserStatusUseCase(doctorRepository);

    // Appointment use cases
    const getAvailableDoctorsUseCase = new GetAvailableDoctorsUsecase(doctorRepository);
    const bookAppointmentUseCase = new BookAppointmentUseCase(appointmentRepository);
    const getPatientAppointmentsUseCase = new GetPatientAppointmentsUseCase(appointmentRepository);
    const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(appointmentRepository);
    const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository);
    const getDoctorAppointmentsUseCase = new GetDoctorAppointmentsUseCase(appointmentRepository);
    const getAppointmentDetailsUseCase = new GetAppointmentDetailsUseCase(appointmentRepository);
    const getDoctorDetailsUseCase = new GetDoctorDetailsUseCase(doctorRepository);

    //Pharmacy Med Category use case

    const addMedCategoryUseCase = new AddMedCategoryUseCase(pharmacyCategoryRepository);
    const getMedCategoryUsecase = new GetMedCategoryUseCase(pharmacyCategoryRepository);
    const addMedicineUseCase = new AddMedicineUsecase(pharmacyMedicineRepository);
    const getMedicineUseCase = new GetMedicineUseCase(pharmacyMedicineRepository);
    const uploadPrescriptionUseCase = new UploadPrescriptionUseCase(prescriptionRepository);

    // Auth Controllers
    const registerUserController = new RegisterUserController(registerUserUseCase);
    const loginUserController = new LoginUserController(loginUserUseCase);
    const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);
    const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

    // Patient Controllers
    const getPatientProfileController = new GetPatientProfileController(getPatientProfileUseCase);
    const updatePatientProfileController = new UpdatePatientProfileController(updatePatientProfileUseCase);

    // Doctor Controllers
    const getDoctorProfileController = new GetDoctorProfileController(getDoctorProfileUseCase);
    const updateDoctorProfileController = new UpdateDoctorProfileController(updateDoctorProfileUseCase);

    // Admin Controllers
    const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
    const createUserController = new CreateUserController(createUserUseCase);
    const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);

    // Appointment Controllers
    const getAvailableDoctorsController = new GetAvailableDoctorsController(getAvailableDoctorsUseCase);
    const bookAppointmentController = new BookAppointmentController(bookAppointmentUseCase);
    const getPatientAppointmentsController = new GetPatientAppointmentsController(getPatientAppointmentsUseCase);
    const rescheduleAppointmentController = new RescheduleAppointmentController(rescheduleAppointmentUseCase);
    const updateAppointmentStatusController = new UpdateAppointmentStatusController(updateAppointmentStatusUseCase);
    const getDoctorAppointmentsController = new GetDoctorAppointmentsController(getDoctorAppointmentsUseCase);
    const getAppointmentDetailsController = new GetAppointmentDetailsController(getAppointmentDetailsUseCase);
    const getDoctorDetailsController = new GetDoctorDetailsController(getDoctorDetailsUseCase);

    //Pharmacy Med Category controllers
    const addMedCategoryController = new AddMedCategoryController(addMedCategoryUseCase);
    const getMedCategoryController = new GetMedCategoryController(getMedCategoryUsecase);
    const addMedicineController = new AddMedicineController(addMedicineUseCase);
    const getMedicineController = new GetMedicineController(getMedicineUseCase);
    const uploadPrescriptionController = new UploadPrescriptionController(uploadPrescriptionUseCase);



    // Routes
    const authRoute = new AuthRoute(
        registerUserController,
        loginUserController,
        forgotPasswordController,
        resetPasswordController
    );
    const patientRoute = new PatientRoute(
        getPatientProfileController,
        updatePatientProfileController
    );
    const doctorRoute = new DoctorRoute(
        getDoctorProfileController,
        updateDoctorProfileController
    );

    const adminRoute = new AdminRoute(
        getAllUsersController,
        createUserController,
        updateUserStatusController
    );

    const appointmentRoute = new AppointmentRoute(
        getAvailableDoctorsController,
        bookAppointmentController,
        getPatientAppointmentsController,
        rescheduleAppointmentController,
        updateAppointmentStatusController,
        getDoctorAppointmentsController,
        getDoctorDetailsController,
        getAppointmentDetailsController
    );

    const pharmacyAdminRoute = new PharmacyAdminRoute(
        addMedCategoryController,
        getMedCategoryController,
        addMedicineController,
        getMedicineController,
        uploadPrescriptionController
    )

    return {
        authRoute,
        patientRoute,
        doctorRoute,
        adminRoute,
        appointmentRoute,
        pharmacyAdminRoute
    };
};