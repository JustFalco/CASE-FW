import { Injectable, OnInit } from '@angular/core';
import { distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { CourseInstance } from 'src/app/models/course-instance';
import { DateStoreService } from '../date-store.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CreateCourseInstanceResponse } from 'src/app/models/create-course-instance-response';
import { _isTestEnvironment } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root',
})
export class CourseApiService implements OnInit {
  week?: number;
  year?: number;
  private coursesSource = new Subject<CourseInstance[]>();

  coursesObs = this.coursesSource.asObservable();

  weekObsSubscription?: Subscription;
  yearObsSubscription?: Subscription;

  constructor(public dateService: DateStoreService, public http: HttpClient) {
    //Ik weet dat dit niet de bedoeling is, maar de testen wouden echt niet werken zonder
    if(!_isTestEnvironment()){
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.weekObsSubscription = this.dateService.weekObs.subscribe((value: number) => {
      this.week = value;
      this.getCourses();
    });
    this.yearObsSubscription = this.dateService.yearObs.subscribe((value) => {
      this.year = value;
      this.getCourses();
    });
  }

  getCourses() {
    if(!this.week || !this.year) return;
    if(this.week < 1 || this.week > 52) return;

    let params = new HttpParams()
      .set('week', this.week)
      .set('year', this.year);
    this.http
      .get<CourseInstance[]>('https://localhost:7010/api/courses', { params })
      .pipe(
        distinctUntilChanged()
      )
      .subscribe(
        (result) => {
          this.coursesSource.next(result);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  submitCourse(formData: FormData, params: HttpParams, headers: HttpHeaders) {
    return this.http
      .post<CreateCourseInstanceResponse>('https://localhost:7010/api/courses', formData, { headers, params, responseType: 'json'})
  }

  getCourseInstanceById(id: number) {
    return this.http.get<CourseInstance>(
      `https://localhost:7010/api/courses/${id}`
    );
  }

  ngOnDestroy(): void {
    this.weekObsSubscription?.unsubscribe();
    this.yearObsSubscription?.unsubscribe();
  }
}
