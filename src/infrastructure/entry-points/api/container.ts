import { RegisterUserController } from '@/application/controllers/authentication/register-user.controller';
import { RegisterUserUseCase } from '@/domain/use-cases/authentication/register-user.use-case';
import { UserRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/user-repository';
import { AppointmentModel, PatientModel, DoctorModel, PharmacyCategoryModel, MedicineModel, PrescriptionModel, OrderModel, LabTestCategoryModel, LabTestModel, MedicineOrderModel, LabTestOrderModel, SpecializationModel } from '@/infrastructure/driven-adapters/database';
import { SpecializationController } from '@/application/controllers/admin/specialization.controller';
import { SpecializationUseCase } from '@/domain/use-cases/admin/specialization.use-case';
import { SpecializationRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/specialization.repository';
import { AuthRoute } from './routes/auth.route';
import { JwtService } from '@/infrastructure/driven-adapters/auth/jwt/jwt.service';
import { jwtConfig } from '@/infrastructure/config/auth/jwt.config';
import { LoginUserController } from '@/application/controllers/authentication/login-user.controller';
import { LoginUserUseCase } from '@/domain/use-cases/authentication/login-user.use-case';
import { ForgotPasswordController } from '@/application/controllers/authentication/forgot-password.controller';
import { ForgotPasswordUseCase } from '@/domain/use-cases/authentication/forgot-password.use-case';
import { MailtrapEmailService } from '@/infrastructure/driven-adapters/email/mailtrap-email.service';
import { BrevoEmailService } from '@/infrastructure/driven-adapters/email/brevo-email.service';
import { ResetPasswordController } from '@/application/controllers/authentication/reset-password.controller';
import { ResetPasswordUseCase } from '@/domain/use-cases/authentication/reset-password.use-case';
import { DoctorPasswordSetController } from '@/application/controllers/authentication/doctor-password-set.controller';
import { DoctorPasswordSetUseCase } from '@/domain/use-cases/authentication/doctor-password-set.use-case';
import { GoogleOAuthController } from '@/application/controllers/authentication/google-oauth.controller';
import { GoogleOAuthUseCase } from '@/domain/use-cases/authentication/google-oauth.use-case';
import { InstagramOAuthController } from '@/application/controllers/authentication/instagram-oauth.controller';
import { InstagramOAuthUseCase } from '@/domain/use-cases/authentication/instagram-oauth.use-case';

import { PatientRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/patient.repository';
import { GetPatientProfileUseCase } from '@/domain/use-cases/patient/get-patient-profile.use-case';
import { GetPatientProfileController } from '@/application/controllers/patient/get-patient-profile.controller';
import { PatientRoute } from './routes/patient.route';
import { UpdatePatientProfileUseCase } from '@/domain/use-cases/patient/update-patient-profile.use-case';
import { UpdatePatientProfileController } from '@/application/controllers/patient/update-patient-profile.controller';
import { GetPatientDashboardCountsUseCase } from '@/domain/use-cases/patient/get-patient-dashboard-counts.use-case';
import { GetPatientDashboardCountsController } from '@/application/controllers/patient/get-patient-dashboard-counts.controller';

import { GetDoctorProfileUseCase } from '@/domain/use-cases/doctor/get-doctor-profile.use-case';
import { GetDoctorProfileController } from '@/application/controllers/doctor/get-doctor-profile.controller';
import { DoctorRoute } from './routes/doctor.route';
import { DoctorRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/doctor-repository';
import { UpdateDoctorProfileUseCase } from '@/domain/use-cases/doctor/update-doctor-profile.use-case';
import { UpdateDoctorProfileController } from '@/application/controllers/doctor/update-doctor-profile.controller';
import { EditDoctorProfileUseCase } from '@/domain/use-cases/doctor/edit-doctor-profile.use-case';
import { EditDoctorProfileController } from '@/application/controllers/doctor/edit-doctor-profile.controller';
import { DeleteDoctorUseCase } from '@/domain/use-cases/doctor/delete-doctor.use-case';
import { DeleteDoctorController } from '@/application/controllers/doctor/delete-doctor.controller';
import { GetDoctorDashboardCountsUseCase } from '@/domain/use-cases/doctor/get-doctor-dashboard-counts.use-case';
import { GetDoctorDashboardCountsController } from '@/application/controllers/doctor/get-doctor-dashboard-counts.controller';

import { GetAllUsersController } from '@/application/controllers/admin/get-all-users.controller';
import { GetAllUsersUseCase } from '@/domain/use-cases/admin/get-all-users.use-case';
import { AdminRoute } from './routes/admin.route';
import { CreateUserController } from '@/application/controllers/admin/create-user.controller';
import { CreateUserUseCase } from '@/domain/use-cases/admin/create-user.use-case';
import { UpdateUserStatusController } from '@/application/controllers/admin/update-user-status.controller';
import { UpdateUserStatusUseCase } from '@/domain/use-cases/admin/update-user-status.use-case';
import { EditPatientByAdminController } from '@/application/controllers/admin/edit-patient-by-admin.controller';
import { EditPatientByAdminUseCase } from '@/domain/use-cases/admin/edit-patient-by-admin.use-case';
import { DeletePatientByAdminController } from '@/application/controllers/admin/delete-patient-by-admin.controller';
import { DeletePatientByAdminUseCase } from '@/domain/use-cases/admin/delete-patient-by-admin.use-case';
import { GetDashboardCountsController } from '@/application/controllers/admin/get-dashboard-counts.controller';
import { GetDashboardCountsUseCase } from '@/domain/use-cases/admin/get-dashboard-counts.use-case';

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
import { GetDoctorCalendarUseCase } from '@/domain/use-cases/appointments/get-doctor-calendar.use-case';
import { GetDoctorCalendarController } from '@/application/controllers/appointments/get-doctor-calendar.controller';



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
import { OrderMedicineUseCase } from '@/domain/use-cases/pharmacyAdmin/order-medicine.use-case';
import { OrderMedicineController } from '@/application/controllers/pharmacyAdmin/order-medicine.controller';
import { OrderRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/order-repository';
import { MedicineOrderRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/medicine-order-repository';
import { LabTestOrderRepositoryMongoDB } from '@/infrastructure/driven-adapters/database/mongodb/repositories/lab-test-order-repository';
import { GetPatientOrdersUseCase } from '@/domain/use-cases/pharmacyAdmin/get-patient-orders.use-case';
import { GetPatientOrdersController } from '@/application/controllers/pharmacyAdmin/get-patient-orders.controller';
import { GetAllOrdersUseCase } from '@/domain/use-cases/pharmacyAdmin/get-all-orders.use-case';
import { GetAllOrdersController } from '@/application/controllers/pharmacyAdmin/get-all-orders.controller';
import { SearchMedicinesUseCase } from '@/domain/use-cases/pharmacyAdmin/search-medicines.use-case';
import { SearchMedicinesController } from '@/application/controllers/pharmacyAdmin/search-medicines.controller';
import { GetMedicineDetailsUseCase } from '@/domain/use-cases/pharmacyAdmin/get-medicine-details.use-case';
import { GetMedicineDetailsController } from '@/application/controllers/pharmacyAdmin/get-medicine-details.controller';
import { UpdateMedicineInventoryUseCase } from '@/domain/use-cases/pharmacyAdmin/update-medicine-inventory.use-case';
import { UpdateMedicineInventoryController } from '@/application/controllers/pharmacyAdmin/update-medicine-inventory.controller';
import { UpdateMedicineUseCase } from '@/domain/use-cases/pharmacyAdmin/update-medicine.use-case';
import { UpdateMedicineController } from '@/application/controllers/pharmacyAdmin/update-medicine.controller';
import { DeleteMedicineUseCase } from '@/domain/use-cases/pharmacyAdmin/delete-medicine.use-case';
import { DeleteMedicineController } from '@/application/controllers/pharmacyAdmin/delete-medicine.controller';
import { UpdateOrderStatusUseCase } from '@/domain/use-cases/pharmacyAdmin/update-order-status.use-case';
import { UpdateOrderStatusController } from '@/application/controllers/pharmacyAdmin/update-order-status.controller';
import { UpdatePharmacyCategoryUseCase } from '@/domain/use-cases/pharmacyAdmin/update-pharmacy-category.use-case';
import { UpdatePharmacyCategoryController } from '@/application/controllers/pharmacyAdmin/update-pharmacy-category.controller';
import { DeletePharmacyCategoryUseCase } from '@/domain/use-cases/pharmacyAdmin/delete-pharmacy-category.use-case';
import { DeletePharmacyCategoryController } from '@/application/controllers/pharmacyAdmin/delete-pharmacy-category.controller';

// Prescription imports
import { CreatePrescriptionUseCase } from '@/domain/use-cases/prescription/create-prescription.use-case';
import { CreatePrescriptionController } from '@/application/controllers/prescription/create-prescription.controller';
import { GetPrescriptionUseCase } from '@/domain/use-cases/prescription/get-prescription.use-case';
import { GetPrescriptionController } from '@/application/controllers/prescription/get-prescription.controller';
import { GetPrescriptionByAppointmentUseCase } from '@/domain/use-cases/prescription/get-prescription-by-appointment.use-case';
import { GetPrescriptionByAppointmentController } from '@/application/controllers/prescription/get-prescription-by-appointment.controller';
import { UpdatePrescriptionUseCase } from '@/domain/use-cases/prescription/update-prescription.use-case';
import { UpdatePrescriptionController } from '@/application/controllers/prescription/update-prescription.controller';
import { DeletePrescriptionUseCase } from '@/domain/use-cases/prescription/delete-prescription.use-case';
import { DeletePrescriptionController } from '@/application/controllers/prescription/delete-prescription.controller';
import { PrescriptionRoute } from './routes/prescription';

// Lab Test imports
import { LabTestCategoryRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTestCategory-repository';
import { LabTestRepository } from '@/infrastructure/driven-adapters/database/mongodb/repositories/labTest-repository';
import { CreateLabTestCategoryUseCase } from '@/domain/use-cases/labTestAdmin/create-lab-test-category.use-case';
import { CreateLabTestCategoryController } from '@/application/controllers/labTestAdmin/create-lab-test-category.controller';
import { GetLabTestCategoriesUseCase } from '@/domain/use-cases/labTestAdmin/get-lab-test-categories.use-case';
import { GetLabTestCategoriesController } from '@/application/controllers/labTestAdmin/get-lab-test-categories.controller';
import { GetLabTestCategoryUseCase } from '@/domain/use-cases/labTestAdmin/get-lab-test-category.use-case';
import { GetLabTestCategoryController } from '@/application/controllers/labTestAdmin/get-lab-test-category.controller';
import { UpdateLabTestCategoryUseCase } from '@/domain/use-cases/labTestAdmin/update-lab-test-category.use-case';
import { UpdateLabTestCategoryController } from '@/application/controllers/labTestAdmin/update-lab-test-category.controller';
import { DeleteLabTestCategoryUseCase } from '@/domain/use-cases/labTestAdmin/delete-lab-test-category.use-case';
import { DeleteLabTestCategoryController } from '@/application/controllers/labTestAdmin/delete-lab-test-category.controller';
import { CreateLabTestUseCase } from '@/domain/use-cases/labTestAdmin/create-lab-test.use-case';
import { CreateLabTestController } from '@/application/controllers/labTestAdmin/create-lab-test.controller';
import { GetLabTestsUseCase } from '@/domain/use-cases/labTestAdmin/get-lab-tests.use-case';
import { GetLabTestsController } from '@/application/controllers/labTestAdmin/get-lab-tests.controller';
import { GetLabTestUseCase } from '@/domain/use-cases/labTestAdmin/get-lab-test.use-case';
import { GetLabTestController } from '@/application/controllers/labTestAdmin/get-lab-test.controller';
import { UpdateLabTestUseCase } from '@/domain/use-cases/labTestAdmin/update-lab-test.use-case';
import { UpdateLabTestController } from '@/application/controllers/labTestAdmin/update-lab-test.controller';
import { DeleteLabTestUseCase } from '@/domain/use-cases/labTestAdmin/delete-lab-test.use-case';
import { DeleteLabTestController } from '@/application/controllers/labTestAdmin/delete-lab-test.controller';
import { UpdateLabTestOrderStatusUseCase } from '@/domain/use-cases/labTestAdmin/update-order-status.use-case';
import { UpdateLabTestOrderStatusController } from '@/application/controllers/labTestAdmin/update-order-status.controller';
import { LabTestAdminRoute } from './routes/labTestAdmin.route';

// Lab Test Order imports
import { OrderLabTestUseCase } from '@/domain/use-cases/labTestOrder/order-lab-test.use-case';
import { OrderLabTestController } from '@/application/controllers/labTestOrder/order-lab-test.controller';
import { GetLabTestOrdersUseCase } from '@/domain/use-cases/labTestOrder/get-lab-test-orders.use-case';
import { GetLabTestOrdersController } from '@/application/controllers/labTestOrder/get-lab-test-orders.controller';
import { LabTestOrderRoute } from './routes/labTestOrder.route';

export interface Container {
    authRoute: AuthRoute;
    patientRoute: PatientRoute;
    doctorRoute: DoctorRoute;
    adminRoute: AdminRoute;
    appointmentRoute: AppointmentRoute;
    pharmacyAdminRoute: PharmacyAdminRoute;
    prescriptionRoute: PrescriptionRoute;
    labTestAdminRoute: LabTestAdminRoute;
    labTestOrderRoute: LabTestOrderRoute;
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
    const orderRepository = new OrderRepositoryMongoDB(OrderModel);
    const medicineOrderRepository = new MedicineOrderRepositoryMongoDB(MedicineOrderModel);
    const labTestOrderRepository = new LabTestOrderRepositoryMongoDB(LabTestOrderModel);
    const specializationRepository = new SpecializationRepository(SpecializationModel);

    const jwtService = new JwtService(
        jwtConfig.secret,
        jwtConfig.expiresIn
    );

    const emailService = new MailtrapEmailService(
        process.env.MAILTRAP_TOKEN || 'your-mailtrap-token'
    );

    const brevoService = new BrevoEmailService(process.env.BREVO_API_KEY || 'dummy-key');


    // Auth Use cases
    const registerUserUseCase = new RegisterUserUseCase(userRepository, brevoService, jwtService);
    const loginUserUseCase = new LoginUserUseCase(userRepository, jwtService);
    const forgotPasswordUseCase = new ForgotPasswordUseCase(
        userRepository,
        jwtService,
        brevoService
    );
    const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, jwtService);
    const doctorPasswordSetUseCase = new DoctorPasswordSetUseCase(userRepository, jwtService);
    const googleOAuthUseCase = new GoogleOAuthUseCase(userRepository);
    const instagramOAuthUseCase = new InstagramOAuthUseCase(userRepository);

    // Patient use cases
    const getPatientProfileUseCase = new GetPatientProfileUseCase(patientRepository);
    const updatePatientProfileUseCase = new UpdatePatientProfileUseCase(patientRepository);
    const getPatientDashboardCountsUseCase = new GetPatientDashboardCountsUseCase(appointmentRepository);

    // Doctor use cases
    const getDoctorProfileUseCase = new GetDoctorProfileUseCase(doctorRepository);
    const updateDoctorProfileUseCase = new UpdateDoctorProfileUseCase(doctorRepository);
    const editDoctorProfileUseCase = new EditDoctorProfileUseCase(doctorRepository);
    const deleteDoctorUseCase = new DeleteDoctorUseCase(doctorRepository);
    const getDoctorDashboardCountsUseCase = new GetDoctorDashboardCountsUseCase(appointmentRepository);

    // Lab Test repositories (moved up for dashboard counts use case)
    const labTestCategoryRepository = new LabTestCategoryRepository(LabTestCategoryModel);
    const labTestRepository = new LabTestRepository(LabTestModel);

    // Admin use cases
    const getAllUsersUseCase = new GetAllUsersUseCase(patientRepository, doctorRepository);
    const createUserUseCase = new CreateUserUseCase(userRepository);
    const updateUserStatusUseCase = new UpdateUserStatusUseCase(doctorRepository);
    const editPatientByAdminUseCase = new EditPatientByAdminUseCase(patientRepository);
    const deletePatientByAdminUseCase = new DeletePatientByAdminUseCase(patientRepository);
    const getDashboardCountsUseCase = new GetDashboardCountsUseCase(
      patientRepository,
      doctorRepository,
      appointmentRepository,
      pharmacyMedicineRepository,
      labTestRepository,
      pharmacyCategoryRepository,
      labTestCategoryRepository
    );

    // Specialization use case
    const specializationUseCase = new SpecializationUseCase(specializationRepository);

    // Specialization controller
    const specializationController = new SpecializationController(specializationUseCase);

    // Appointment use cases
    const getAvailableDoctorsUseCase = new GetAvailableDoctorsUsecase(doctorRepository);
    const bookAppointmentUseCase = new BookAppointmentUseCase(appointmentRepository);
    const getPatientAppointmentsUseCase = new GetPatientAppointmentsUseCase(appointmentRepository);
    const rescheduleAppointmentUseCase = new RescheduleAppointmentUseCase(appointmentRepository);
    const updateAppointmentStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository);
    const getDoctorAppointmentsUseCase = new GetDoctorAppointmentsUseCase(appointmentRepository);
    const getAppointmentDetailsUseCase = new GetAppointmentDetailsUseCase(appointmentRepository, patientRepository, doctorRepository);
    const getDoctorDetailsUseCase = new GetDoctorDetailsUseCase(doctorRepository);
    const getDoctorCalendarUseCase = new GetDoctorCalendarUseCase(appointmentRepository);

    //Pharmacy Med Category use case

    const addMedCategoryUseCase = new AddMedCategoryUseCase(pharmacyCategoryRepository);
    const getMedCategoryUsecase = new GetMedCategoryUseCase(pharmacyCategoryRepository);
    const addMedicineUseCase = new AddMedicineUsecase(pharmacyMedicineRepository);
    const getMedicineUseCase = new GetMedicineUseCase(pharmacyMedicineRepository);
    const uploadPrescriptionUseCase = new UploadPrescriptionUseCase(prescriptionRepository);
    const orderMedicineUseCase = new OrderMedicineUseCase(medicineOrderRepository, prescriptionRepository, pharmacyMedicineRepository);
    const getPatientOrdersUseCase = new GetPatientOrdersUseCase(medicineOrderRepository, labTestOrderRepository);
    const getAllOrdersUseCase = new GetAllOrdersUseCase(medicineOrderRepository, labTestOrderRepository, patientRepository, prescriptionRepository);
    const searchMedicinesUseCase = new SearchMedicinesUseCase(pharmacyMedicineRepository);
    const getMedicineDetailsUseCase = new GetMedicineDetailsUseCase(pharmacyMedicineRepository);
    const updateMedicineInventoryUseCase = new UpdateMedicineInventoryUseCase(pharmacyMedicineRepository);
    const updateMedicineUseCase = new UpdateMedicineUseCase(pharmacyMedicineRepository);
    const deleteMedicineUseCase = new DeleteMedicineUseCase(pharmacyMedicineRepository);
    const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(medicineOrderRepository, pharmacyMedicineRepository);
    const updatePharmacyCategoryUseCase = new UpdatePharmacyCategoryUseCase(pharmacyCategoryRepository);
    const deletePharmacyCategoryUseCase = new DeletePharmacyCategoryUseCase(pharmacyCategoryRepository);

    // Prescription use cases
    const createPrescriptionUseCase = new CreatePrescriptionUseCase(prescriptionRepository);
    const getPrescriptionUseCase = new GetPrescriptionUseCase(prescriptionRepository);
    const getPrescriptionByAppointmentUseCase = new GetPrescriptionByAppointmentUseCase(prescriptionRepository);
    const updatePrescriptionUseCase = new UpdatePrescriptionUseCase(prescriptionRepository);
    const deletePrescriptionUseCase = new DeletePrescriptionUseCase(prescriptionRepository);

    // Lab Test Category use cases
    const createLabTestCategoryUseCase = new CreateLabTestCategoryUseCase(labTestCategoryRepository);
    const getLabTestCategoriesUseCase = new GetLabTestCategoriesUseCase(labTestCategoryRepository);
    const getLabTestCategoryUseCase = new GetLabTestCategoryUseCase(labTestCategoryRepository);
    const updateLabTestCategoryUseCase = new UpdateLabTestCategoryUseCase(labTestCategoryRepository);
    const deleteLabTestCategoryUseCase = new DeleteLabTestCategoryUseCase(labTestCategoryRepository);

    // Lab Test use cases
    const createLabTestUseCase = new CreateLabTestUseCase(labTestRepository, labTestCategoryRepository);
    const getLabTestsUseCase = new GetLabTestsUseCase(labTestRepository);
    const getLabTestUseCase = new GetLabTestUseCase(labTestRepository);
    const updateLabTestUseCase = new UpdateLabTestUseCase(labTestRepository, labTestCategoryRepository);
    const deleteLabTestUseCase = new DeleteLabTestUseCase(labTestRepository);

    // Lab Test Order use cases
    const orderLabTestUseCase = new OrderLabTestUseCase(labTestOrderRepository, labTestRepository, prescriptionRepository);
    const getLabTestOrdersUseCase = new GetLabTestOrdersUseCase(labTestOrderRepository);
    const updateLabTestOrderStatusUseCase = new UpdateLabTestOrderStatusUseCase(labTestOrderRepository);

    // Lab Test Category controllers
    const createLabTestCategoryController = new CreateLabTestCategoryController(createLabTestCategoryUseCase);
    const getLabTestCategoriesController = new GetLabTestCategoriesController(getLabTestCategoriesUseCase);
    const getLabTestCategoryController = new GetLabTestCategoryController(getLabTestCategoryUseCase);
    const updateLabTestCategoryController = new UpdateLabTestCategoryController(updateLabTestCategoryUseCase);
    const deleteLabTestCategoryController = new DeleteLabTestCategoryController(deleteLabTestCategoryUseCase);

    // Lab Test controllers
    const createLabTestController = new CreateLabTestController(createLabTestUseCase);
    const getLabTestsController = new GetLabTestsController(getLabTestsUseCase);
    const getLabTestController = new GetLabTestController(getLabTestUseCase);
    const updateLabTestController = new UpdateLabTestController(updateLabTestUseCase);
    const deleteLabTestController = new DeleteLabTestController(deleteLabTestUseCase);

    // Lab Test Order controllers
    const orderLabTestController = new OrderLabTestController(orderLabTestUseCase);
    const getLabTestOrdersController = new GetLabTestOrdersController(getLabTestOrdersUseCase);
    const updateLabTestOrderStatusController = new UpdateLabTestOrderStatusController(updateLabTestOrderStatusUseCase);

    // Auth Controllers
    const registerUserController = new RegisterUserController(registerUserUseCase);
    const loginUserController = new LoginUserController(loginUserUseCase);
    const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);
    const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
    const doctorPasswordSetController = new DoctorPasswordSetController(doctorPasswordSetUseCase);
    const googleOAuthController = new GoogleOAuthController(googleOAuthUseCase, jwtService);
    const instagramOAuthController = new InstagramOAuthController(instagramOAuthUseCase, jwtService);

    // Patient Controllers
    const getPatientProfileController = new GetPatientProfileController(getPatientProfileUseCase);
    const updatePatientProfileController = new UpdatePatientProfileController(updatePatientProfileUseCase);
    const getPatientDashboardCountsController = new GetPatientDashboardCountsController(getPatientDashboardCountsUseCase);

    // Doctor Controllers
    const getDoctorProfileController = new GetDoctorProfileController(getDoctorProfileUseCase);
    const updateDoctorProfileController = new UpdateDoctorProfileController(updateDoctorProfileUseCase);
    const editDoctorProfileController = new EditDoctorProfileController(editDoctorProfileUseCase);
    const deleteDoctorController = new DeleteDoctorController(deleteDoctorUseCase);
    const getDoctorDashboardCountsController = new GetDoctorDashboardCountsController(getDoctorDashboardCountsUseCase);

    // Admin Controllers
    const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);
    const createUserController = new CreateUserController(createUserUseCase);
    const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);
    const editPatientByAdminController = new EditPatientByAdminController(editPatientByAdminUseCase);
    const deletePatientByAdminController = new DeletePatientByAdminController(deletePatientByAdminUseCase);
    const getDashboardCountsController = new GetDashboardCountsController(getDashboardCountsUseCase);

    // Appointment Controllers
    const getAvailableDoctorsController = new GetAvailableDoctorsController(getAvailableDoctorsUseCase);
    const bookAppointmentController = new BookAppointmentController(bookAppointmentUseCase);
    const getPatientAppointmentsController = new GetPatientAppointmentsController(getPatientAppointmentsUseCase);
    const rescheduleAppointmentController = new RescheduleAppointmentController(rescheduleAppointmentUseCase);
    const updateAppointmentStatusController = new UpdateAppointmentStatusController(updateAppointmentStatusUseCase);
    const getDoctorAppointmentsController = new GetDoctorAppointmentsController(getDoctorAppointmentsUseCase);
    const getAppointmentDetailsController = new GetAppointmentDetailsController(getAppointmentDetailsUseCase);
    const getDoctorDetailsController = new GetDoctorDetailsController(getDoctorDetailsUseCase);
    const getDoctorCalendarController = new GetDoctorCalendarController(getDoctorCalendarUseCase);

    //Pharmacy Med Category controllers
    const addMedCategoryController = new AddMedCategoryController(addMedCategoryUseCase);
    const getMedCategoryController = new GetMedCategoryController(getMedCategoryUsecase);
    const addMedicineController = new AddMedicineController(addMedicineUseCase);
    const getMedicineController = new GetMedicineController(getMedicineUseCase);
    const uploadPrescriptionController = new UploadPrescriptionController(uploadPrescriptionUseCase);
    const orderMedicineController = new OrderMedicineController(orderMedicineUseCase, patientRepository, prescriptionRepository);
    const getPatientOrdersController = new GetPatientOrdersController(getPatientOrdersUseCase);
    const getAllOrdersController = new GetAllOrdersController(getAllOrdersUseCase);
    const searchMedicinesController = new SearchMedicinesController(searchMedicinesUseCase);
    const getMedicineDetailsController = new GetMedicineDetailsController(getMedicineDetailsUseCase);
    const updateMedicineInventoryController = new UpdateMedicineInventoryController(updateMedicineInventoryUseCase);
    const updateMedicineController = new UpdateMedicineController(updateMedicineUseCase);
    const deleteMedicineController = new DeleteMedicineController(deleteMedicineUseCase);
    const updateOrderStatusController = new UpdateOrderStatusController(updateOrderStatusUseCase);
    const updatePharmacyCategoryController = new UpdatePharmacyCategoryController(updatePharmacyCategoryUseCase);
    const deletePharmacyCategoryController = new DeletePharmacyCategoryController(deletePharmacyCategoryUseCase);

    // Prescription Controllers
    const createPrescriptionController = new CreatePrescriptionController(createPrescriptionUseCase);
    const getPrescriptionController = new GetPrescriptionController(getPrescriptionUseCase);
    const getPrescriptionByAppointmentController = new GetPrescriptionByAppointmentController(getPrescriptionByAppointmentUseCase);
    const updatePrescriptionController = new UpdatePrescriptionController(updatePrescriptionUseCase);
    const deletePrescriptionController = new DeletePrescriptionController(deletePrescriptionUseCase);



    // Routes
    const authRoute = new AuthRoute(
        registerUserController,
        loginUserController,
        forgotPasswordController,
        resetPasswordController,
        doctorPasswordSetController,
        googleOAuthController,
        instagramOAuthController
    );
    const patientRoute = new PatientRoute(
        getPatientProfileController,
        updatePatientProfileController,
        getPatientDashboardCountsController
    );
    const doctorRoute = new DoctorRoute(
        getDoctorProfileController,
        updateDoctorProfileController,
        editDoctorProfileController,
        deleteDoctorController,
        getDoctorDashboardCountsController
    );

    const adminRoute = new AdminRoute(
        getAllUsersController,
        createUserController,
        updateUserStatusController,
        getDashboardCountsController,
        editPatientByAdminController,
        deletePatientByAdminController,
        specializationController
    );

    const appointmentRoute = new AppointmentRoute(
        getAvailableDoctorsController,
        bookAppointmentController,
        getPatientAppointmentsController,
        rescheduleAppointmentController,
        updateAppointmentStatusController,
        getDoctorAppointmentsController,
        getDoctorDetailsController,
        getAppointmentDetailsController,
        getDoctorCalendarController
    );

    const pharmacyAdminRoute = new PharmacyAdminRoute(
        addMedCategoryController,
        getMedCategoryController,
        addMedicineController,
        getMedicineController,
        searchMedicinesController,
        getMedicineDetailsController,
        updateMedicineInventoryController,
        updateMedicineController,
        deleteMedicineController,
        uploadPrescriptionController,
        orderMedicineController,
        getPatientOrdersController,
        getAllOrdersController,
        updateOrderStatusController,
        updatePharmacyCategoryController,
        deletePharmacyCategoryController
    );

    const prescriptionRoute = new PrescriptionRoute(
        createPrescriptionController,
        getPrescriptionController,
        getPrescriptionByAppointmentController,
        updatePrescriptionController,
        deletePrescriptionController
    );

    const labTestAdminRoute = new LabTestAdminRoute(
        createLabTestCategoryController,
        getLabTestCategoriesController,
        getLabTestCategoryController,
        updateLabTestCategoryController,
        deleteLabTestCategoryController,
        createLabTestController,
        getLabTestsController,
        getLabTestController,
        updateLabTestController,
        deleteLabTestController,
        updateLabTestOrderStatusController
    );

    return {
        authRoute,
        patientRoute,
        doctorRoute,
        adminRoute,
        appointmentRoute,
        pharmacyAdminRoute,
        prescriptionRoute,
        labTestAdminRoute,
        labTestOrderRoute: new LabTestOrderRoute(
            orderLabTestController,
            getLabTestOrdersController
        )
    };
};