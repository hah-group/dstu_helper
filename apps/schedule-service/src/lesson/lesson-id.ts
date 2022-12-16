export interface LessonIdInfo {
  groupId: number;
  start: number;
  subgroup: number;
  teacherId?: number;
}

export const GetLessonId: (data: LessonIdInfo) => string = (data) => {
  return [data.groupId, data.start, data.subgroup, data.teacherId].join('_');
};
