export interface CreateCourseInstanceResponse {
    succes: boolean;
    errors: string[];
    messages: string[];
    createdCourses: number;
    createdCourseInstances: number;
    duplicateCourseInstances: number;
    lineNrError: number;
}