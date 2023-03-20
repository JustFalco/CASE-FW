import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateStoreService {

  private weekSource = new BehaviorSubject<number>(1);
  private yearSource = new BehaviorSubject<number>(2023);

  public weekObs = this.weekSource.asObservable()
  public yearObs = this.yearSource.asObservable()

  constructor() {
    let currentDate:any = new Date();
    let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    
    this.yearSource.next(currentDate.getFullYear()) 
    this.weekSource.next(Math.ceil(days / 7));
  }

  public nextWeek(){
    //TODO zorgen dat het jaar ook aanpast op basis van de weeknummers
    this.weekSource.next(this.weekSource.value + 1)
  }

  public prefWeek(){
    //TODO zorgen dat het jaar ook aanpast op basis van de weeknummers
    this.weekSource.next(this.weekSource.value - 1)
  }

  public setWeek(weekNr:number){
    this.weekSource.next(weekNr)
  }

  public setYear(year:number){
    this.yearSource.next(year)
  }
}
