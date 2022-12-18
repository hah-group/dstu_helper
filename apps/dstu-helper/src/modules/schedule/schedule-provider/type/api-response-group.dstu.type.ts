import { ApiResponseDSTU } from './api-response.dstu.type';

interface ApiGroupDataItem {
  name: string;
  id: number;
  facul: string;
  facultyID: number;
}

export type ApiResponseGroupDSTU = ApiResponseDSTU<ApiGroupDataItem[]>;
