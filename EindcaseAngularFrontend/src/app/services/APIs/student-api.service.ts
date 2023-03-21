import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateStudentDTO } from 'src/app/models/create-student-dto';
import { CourseApiService } from './course-api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentApiService {

  constructor(public http: HttpClient, private courseService: CourseApiService) { }

  postStudent(studentDto: CreateStudentDTO){
    this.http.post("https://localhost:7010/api/student", studentDto).subscribe((result) => {
      this.courseService.getCourses()
    })
  }
}

