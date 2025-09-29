import { SearchMedicinesRequest, SearchMedicinesResponse } from '@/domain/types/pharmacyAdmin/search-medicines.type';

export interface ISearchMedicinesUseCase {
    execute(request: SearchMedicinesRequest): Promise<SearchMedicinesResponse>;
}