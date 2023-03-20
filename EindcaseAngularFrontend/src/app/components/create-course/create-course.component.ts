import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  courseCreateForm = new FormGroup({
    files: new FormControl('', [Validators.required]),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });

  submitCourse(){
    //all field required
    //file must be .txt
    //start and end date can only be 5 days appart
    //start and end date must be in one week ma-vr
  }
}

export function requiredFileType( type: string ) {
  return function (control: FormControl) {
    const file = control.value;
    if ( file ) {
      const extension = file.name.split('.')[1].toLowerCase();
      if ( type.toLowerCase() !== extension.toLowerCase() ) {
        return {
          requiredFileType: true
        };
      }
      
      return null
    }

    return null
  };
}