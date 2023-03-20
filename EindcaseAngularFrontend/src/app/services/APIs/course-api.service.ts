import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CourseInstance } from 'src/app/models/course-instance';
import { DateStoreService } from '../date-store.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

  submitCourse(body: FormData){

    console.log("Submitting: " + JSON.stringify(body) )
    const headers = new HttpHeaders().append('Content-Disposition', 'multipart/form-data')

    this.http.post("https://localhost:7010/api/courses", body, {headers}).subscribe(
      (result) =>{
        console.log(result)
      },
      (error) => {
        console.error(error)
      }
    )
  }

}
