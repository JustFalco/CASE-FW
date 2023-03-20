import { Component, OnInit } from '@angular/core';
import { DateStoreService } from 'src/app/services/date-store.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css']
})
export class DateSelectorComponent implements OnInit{
  week: Number | undefined;
  jaar: Number | undefined

  constructor(public dateService: DateStoreService) {
    
  }
  

  ngOnInit(): void {
    this.dateService.weekObs.subscribe(value => {
      this.week = value
    })
    this.dateService.yearObs.subscribe(value => {
      this.jaar = value
    })
  }

  nextWeek(){
    this.dateService.nextWeek()
  }

  prefWeek(){
    this.dateService.prefWeek()
  }
  
}
