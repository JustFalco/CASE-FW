import { Student } from "./student";

export interface PostStudentResponse {
    succes: boolean;
    errors: string[];
    messages: string[];
    createdStudent: Student;
}