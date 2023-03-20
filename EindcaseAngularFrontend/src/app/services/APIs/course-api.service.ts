import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CourseInstance } from 'src/app/models/course-instance';
import { DateStoreService } from '../date-store.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseApiService {

  week?:number
  year?:number
  private coursesSource = new Subject<CourseInstance[]>

  coursesObs = this.coursesSource.asObservable()

  constructor(public dateService: DateStoreService, public http: HttpClient) {
    dateService.weekObs.subscribe(value => {
      this.week = value
      this.getCourses()
    })
    dateService.yearObs.subscribe(value => {
      this.year = value
      this.getCourses()
    })
   }

  getCourses(){
    let params = new HttpParams().set("week", this.week!).set("year", this.year!)
    this.http.get<CourseInstance[]>("https://localhost:7010/api/courses", {params}).subscribe(
      (result) => {
        this.coursesSource.next(result)
      },
      (error) => {
        console.error(error)
      }
    )
  }

}
