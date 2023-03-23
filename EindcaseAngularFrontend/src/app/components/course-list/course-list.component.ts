import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Course } from 'src/app/models/course';
import { CourseInstance } from 'src/app/models/course-instance';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css'],
})
export class CourseListComponent implements OnInit{
  courses?: CourseInstance[];

  coursesSub?: Subscription;

  constructor(public courseService: CourseApiService) {
    this.courseService.getCourses()
  }

  ngOnInit(): void {
    this.coursesSub = this.courseService.coursesObs.subscribe(data => {
      this.courses = data
    })
  }

  ngOnDestroy(): void {
    this.coursesSub?.unsubscribe()
  }
}
