import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '@/application/middlewares/auth.middleware';
import { AddMedCategoryController } from '@/application/controllers/pharmacyAdmin/add-med-category.controller';
import { GetMedCategoryController } from '@/application/controllers/pharmacyAdmin/get-med-category.controller';
import { AddMedicineController } from '@/application/controllers/pharmacyAdmin/add-medicine.controller';
import { GetMedicineController } from '@/application/controllers/pharmacyAdmin/get-medicine.controller';
import { UploadPrescriptionController } from '@/application/controllers/pharmacyAdmin/upload-prescription.controller';
import { OrderMedicineController } from '@/application/controllers/pharmacyAdmin/order-medicine.controller';
import { GetPatientOrdersController } from '@/application/controllers/pharmacyAdmin/get-patient-orders.controller';
import { GetAllOrdersController } from '@/application/controllers/pharmacyAdmin/get-all-orders.controller';
import { SearchMedicinesController } from '@/application/controllers/pharmacyAdmin/search-medicines.controller';
import { GetMedicineDetailsController } from '@/application/controllers/pharmacyAdmin/get-medicine-details.controller';
import { UpdateMedicineInventoryController } from '@/application/controllers/pharmacyAdmin/update-medicine-inventory.controller';
import { UpdateMedicineController } from '@/application/controllers/pharmacyAdmin/update-medicine.controller';
import { DeleteMedicineController } from '@/application/controllers/pharmacyAdmin/delete-medicine.controller';
import { UpdateOrderStatusController } from '@/application/controllers/pharmacyAdmin/update-order-status.controller';
import { UpdatePharmacyCategoryController } from '@/application/controllers/pharmacyAdmin/update-pharmacy-category.controller';
import { DeletePharmacyCategoryController } from '@/application/controllers/pharmacyAdmin/delete-pharmacy-category.controller';
import { GetPharmacyDashboardCountsController } from '@/application/controllers/pharmacyAdmin/get-pharmacy-dashboard-counts.controller';
import multer from 'multer';

// Note: You need to install multer: npm install multer @types/multer
// import multer from 'multer';


export class PharmacyAdminRoute {
    public router: Router;

    constructor(private readonly addMedCategoryController: AddMedCategoryController,
        private readonly getMedCategoryController: GetMedCategoryController,
        private readonly addMedicineController: AddMedicineController,
        private readonly getMedicineController: GetMedicineController,
        private readonly searchMedicinesController: SearchMedicinesController,
        private readonly getMedicineDetailsController: GetMedicineDetailsController,
        private readonly updateMedicineInventoryController: UpdateMedicineInventoryController,
        private readonly updateMedicineController: UpdateMedicineController,
        private readonly deleteMedicineController: DeleteMedicineController,
        private readonly uploadPrescriptionController: UploadPrescriptionController,
        private readonly orderMedicineController: OrderMedicineController,
        private readonly getPatientOrdersController: GetPatientOrdersController,
        private readonly getAllOrdersController: GetAllOrdersController,
        private readonly updateOrderStatusController: UpdateOrderStatusController,
        private readonly updatePharmacyCategoryController: UpdatePharmacyCategoryController,
        private readonly deletePharmacyCategoryController: DeletePharmacyCategoryController,
        private readonly getPharmacyDashboardCountsController: GetPharmacyDashboardCountsController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post('/pharmacy/categories', authenticateToken, (req, res) => this.addMedCategoryController.handle(req, res)
        );

        this.router.get('/pharmacy/categories', authenticateToken, (req, res) => this.getMedCategoryController.handle(req, res)
        );

        this.router.put('/pharmacy/categories/:categoryId', authenticateToken, (req, res) => this.updatePharmacyCategoryController.handle(req, res)
        );

        this.router.delete('/pharmacy/categories/:categoryId', authenticateToken, (req, res) => this.deletePharmacyCategoryController.handle(req, res)
        );

        this.router.post('/pharmacy/medicines', authenticateToken, (req, res) => this.addMedicineController.handle(req, res)
        );

        this.router.get('/pharmacy/medicines', authenticateToken, (req, res) => this.getMedicineController.handle(req, res)
        );

        this.router.get('/pharmacy/medicines/search', authenticateToken, authorizeRoles(['doctor', 'admin', 'pharmadmin']), (req, res) => this.searchMedicinesController.handle(req, res)
        );

        this.router.get('/pharmacy/medicines/:medicineId', authenticateToken, (req, res) => this.getMedicineDetailsController.handle(req, res)
        );

        this.router.put('/pharmacy/medicines/:medicineId/inventory', authenticateToken, (req, res) => this.updateMedicineInventoryController.handle(req, res)
        );

        this.router.put('/pharmacy/medicines/:medicineId', authenticateToken, (req, res) => this.updateMedicineController.handle(req, res)
        );

        this.router.delete('/pharmacy/medicines/:medicineId', authenticateToken, (req, res) => this.deleteMedicineController.handle(req, res)
        );

        // Multer configuration for file uploads
        const storage = multer.diskStorage({
            destination: (req: any, file: any, cb: any) => {
                cb(null, 'uploads/prescriptions/');
            },
            filename: (req: any, file: any, cb: any) => {
                const timestamp = Date.now();
                const extension = file.originalname.split('.').pop() || 'bin';
                const nameWithoutExt = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
                const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
                cb(null, `prescription_${timestamp}_${sanitizedName}.${extension}`);
            }
        });

        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit
            },
            fileFilter: (req: any, file: any, cb: any) => {
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'application/pdf',
                    'image/webp'
                ];

                if (allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, and WebP are allowed.'));
                }
            }
        });

        // Prescription upload route with file handling
        this.router.post('/pharmacy/prescriptions/upload', authenticateToken, upload.single('prescription'), (req: any, res: any) => this.uploadPrescriptionController.handle(req, res));

        // Order medicines route
        this.router.post('/pharmacy/orders', authenticateToken, (req, res) => this.orderMedicineController.handle(req, res));

        // Get patient orders route
        this.router.get('/pharmacy/orders/patient', authenticateToken, (req, res) => this.getPatientOrdersController.handle(req, res));

        // Get all orders route with filtering (Admin, Pharmacy Admin, and Lab Admin)
        this.router.get('/pharmacy/orders', authenticateToken, authorizeRoles(['admin', 'pharmadmin', 'labadmin']), (req, res) => this.getAllOrdersController.handle(req, res));

        // Update order status route (Admin and Pharmacy Admin)
        this.router.put('/pharmacy/orders/:orderId/status', authenticateToken, authorizeRoles(['admin', 'pharmadmin']), (req, res) => this.updateOrderStatusController.handle(req, res));

        // Pharmacy dashboard counts route (Pharmacy Admin only)
        this.router.get('/pharmacy/dashboard/counts', authenticateToken, authorizeRoles(['pharmadmin']), (req, res) =>
            this.getPharmacyDashboardCountsController.handle(req, res)
        );
    }
}