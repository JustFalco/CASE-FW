import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from "@angular/common"

@Component({
  selector: 'app-previous-page-button',
  templateUrl: './previous-page-button.component.html',
  styleUrls: ['./previous-page-button.component.css']
})
export class PreviousPageButtonComponent {

  constructor(public router: Router, private location: Location){

  }

  back(){
    this.location.back()
  }
}
