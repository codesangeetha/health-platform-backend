import { setupDependencies } from './container';
import { app } from './app';

export const setupRoutes = () => {
  const { authRoute, patientRoute, doctorRoute, adminRoute, appointmentRoute ,pharmacyAdminRoute, prescriptionRoute, labTestAdminRoute, labTestOrderRoute } = setupDependencies();

  app.use('/api/v1', authRoute.router);
  app.use('/api/v1', patientRoute.router);
  app.use('/api/v1', doctorRoute.router);
  app.use('/api/v1', adminRoute.router);
  app.use('/api/v1', appointmentRoute.router);
  app.use('/api/v1', pharmacyAdminRoute.router);
  app.use('/api/v1', prescriptionRoute.router);
  app.use('/api/v1', labTestAdminRoute.router);
  app.use('/api/v1', labTestOrderRoute.router);
};
