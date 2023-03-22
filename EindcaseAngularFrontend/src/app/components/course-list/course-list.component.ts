import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course';
import { CourseInstance } from 'src/app/models/course-instance';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent{
  courses?: CourseInstance[];

  constructor(public courseService: CourseApiService) {
    this.courseService.coursesObs.subscribe(data => {
      this.courses = data
    })
    this.courseService.getCourses()
  }

}
