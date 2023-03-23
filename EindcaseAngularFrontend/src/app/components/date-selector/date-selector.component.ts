import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateStoreService } from 'src/app/services/date-store.service';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.css'],
})
export class DateSelectorComponent implements OnInit {
  week: Number | undefined;
  year: Number | undefined;

  dateEditForm = new FormGroup({
    weekInput: new FormControl(0),
    yearInput: new FormControl(0),
  });

  editWeek: boolean = false;
  editYear: boolean = false;

  constructor(public dateService: DateStoreService) {}

  weekSub?: Subscription;
  yearSub?: Subscription;

  ngOnInit(): void {
    this.weekSub = this.subscribeToWeek();
    this.yearSub = this.subscribeToYear();
  }

  subscribeToWeek() {
    return this.dateService.weekObs.subscribe((value: number) => {
      this.week = value;
      this.dateEditForm.patchValue({
        weekInput: value,
      });
    });
  }

  subscribeToYear() {
    return this.dateService.yearObs.subscribe((value) => {
      this.year = value;
      this.dateEditForm.patchValue({
        yearInput: value,
      });
    });
  }

  nextWeek() {
    this.dateService.nextWeek();
  }

  prefWeek() {
    this.dateService.prefWeek();
  }

  setDate() {
    this.editWeek = false;
    this.editYear = false;
    this.dateService.setWeek(this.dateEditForm.get('weekInput')?.value!);
    this.dateService.setYear(this.dateEditForm.get('yearInput')?.value!);
  }

  ngOnDestroy(): void {
    this.weekSub?.unsubscribe();
    this.yearSub?.unsubscribe();
  }
}
