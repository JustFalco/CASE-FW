import { Course } from "./course";
import { Student } from "./student";

export interface CourseInstance{
    id: number,
    startDate: Date,
    students: Student[],
    courseId: number,
    course: Course
}