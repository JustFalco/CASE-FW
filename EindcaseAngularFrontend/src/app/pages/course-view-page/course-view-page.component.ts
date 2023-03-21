import { Component } from '@angular/core';
import { DateStoreService } from 'src/app/services/date-store.service';

@Component({
  selector: 'app-course-view-page',
  templateUrl: './course-view-page.component.html',
  styleUrls: ['./course-view-page.component.css']
})
export class CourseViewPageComponent {
  constructor(dateStoreSevice: DateStoreService){
    dateStoreSevice.setQueryParms()
  }
}
