import { Component, Input } from '@angular/core';
import { CourseInstance } from 'src/app/models/course-instance';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  @Input("courseInstance") courseInstance?: CourseInstance
}
