import { ApiResponseDSTU } from './api-response.dstu.type';

interface ApiScheduleData {
  rasp: ApiDSTUScheduleItem[];
  info: {
    group: {
      name: string;
      groupID: number;
    };
    selectedNumNed: number;
    dateUploadingRasp: string;
  };
}

export interface ApiDSTUScheduleItem {
  датаНачала: string;
  датаОкончания: string;
  деньНедели: number;
  дисциплина: string;
  преподаватель: string;
  должность: string;
  аудитория: string;
  номерЗанятия: number;
  кодПреподавателя: number;
  код: number;
}

export type ApiResponseScheduleDSTU = ApiResponseDSTU<ApiScheduleData>;
