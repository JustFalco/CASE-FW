import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CourseInstance } from 'src/app/models/course-instance';
import { Student } from 'src/app/models/student';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';

@Component({
  selector: 'app-course-details-page',
  templateUrl: './course-details-page.component.html',
  styleUrls: ['./course-details-page.component.css'],
})
export class CourseDetailsPageComponent implements OnInit {
  courseInstance?: CourseInstance;
  private routeSub?: Subscription;

  constructor(
    private courseService: CourseApiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.courseService
        .getCourseInstanceById(params['id'])
        .subscribe((result) => (this.courseInstance = result));
    });
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  updateInstanceStudentsList(student: Student){
    this.courseInstance?.students.push(student)
  }
}
