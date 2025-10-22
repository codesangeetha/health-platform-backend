import { GetAllMedicinesRequest, GetAllMedicinesResponse } from '@/domain/types/pharmacyAdmin/get-medicine.type';

export interface IGetMedicineUseCase {
    execute(request: GetAllMedicinesRequest): Promise<GetAllMedicinesResponse>;
}