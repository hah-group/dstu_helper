export type ApiResponseRaspDstuType = {
  data: {
    rasp: DstuRasp[];
    info: {
      group: {
        name: string;
        groupID: number;
      };
      selectedNumNed: number;
      dateUploadingRasp: string;
    };
  };
  state: number;
};

export type DstuRasp = {
  датаНачала: string;
  датаОкончания: string;
  деньНедели: number;
  дисциплина: string;
  преподаватель: string;
  аудитория: string;
  номерЗанятия: number;
  кодПреподавателя: number;
  код: number;
};
