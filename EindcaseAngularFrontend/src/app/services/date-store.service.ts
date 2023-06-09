import { Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateStoreService implements OnInit{
  private weekSource = new BehaviorSubject<number>(this.calculateWeekNumber());
  private yearSource = new BehaviorSubject<number>(2023);

  public weekObs = this.weekSource.asObservable();
  public yearObs = this.yearSource.asObservable();

  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.getQueryParams();
    this.setQueryParms()
  }

  public nextWeek() {
    if(Number(this.weekSource.value) === 52){
      this.yearSource.next(Number(this.yearSource.value) + 1)
      this.weekSource.next(1);
    }else{
      //Stupid parsing error when not using number
      this.weekSource.next(1 + Number(this.weekSource.value));
    }
    
    this.setQueryParms();
  }

  public prefWeek() {
    
    if(Number(this.weekSource.value) === 1){
      this.yearSource.next(Number(this.yearSource.value) - 1)
      this.weekSource.next(52);
    }else{
      this.weekSource.next(Number(this.weekSource.value) - 1);
    }
    this.setQueryParms();
  }

  public setWeek(weekNr: number) {
    this.weekSource.next(weekNr);
    this.setQueryParms();
  }

  public setYear(year: number) {
    this.yearSource.next(year);
    this.setQueryParms();
  }

  public setQueryParms() {
    let queryParams: Params = {
      week: this.weekSource.value,
      year: this.yearSource.value,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', 
    });
  }

  public getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (!!params['year']) {
        this.yearSource.next(params['year']);
      } else {
        let currentDate: any = new Date();
        this.yearSource.next(currentDate.getFullYear());
      }
      if (!!params['week']) {
        this.weekSource.next(params['week']);
      } else {
        let week = this.calculateWeekNumber();
        this.weekSource.next(week);
      }
    });
  }

  private calculateWeekNumber() {
    let currentDate: any = new Date();
    let startDate: any = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor(
      (currentDate - startDate) / (24 * 60 * 60 * 1000)
    );
    let week = Math.ceil(days / 7);

    return week;
  }

}