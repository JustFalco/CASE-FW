import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CreateCourseInstanceResponse } from 'src/app/models/create-course-instance-response';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  submitResult?: string;
  submitError?: string;
  triedToInputWrongFile = false;

  courseCreateForm = new FormGroup({
    files: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required]),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });

  constructor(
    public courseService: CourseApiService,
    public http: HttpClient
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].name.split('.')[1].toLowerCase() !== 'txt') {
        this.courseCreateForm.get('files')?.reset();
        this.triedToInputWrongFile = true;
        return;
      } else {
        this.triedToInputWrongFile = false;
      }

      const file = event.target.files[0];
      this.courseCreateForm.patchValue({
        fileSource: file,
      });
    }
  }

  submitCourse() {
    this.submitResult = undefined;
    this.submitError = undefined;
    //all field required
    if (this.courseCreateForm.invalid) {
      this.submitError = 'All fields are required';
      return;
    }

    //start date must be before end date
    if (
      this.courseCreateForm.get('startDate')!.value! >
      this.courseCreateForm.get('endDate')!.value!
    ) {
      this.submitError = 'Start date must be before end date';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.courseCreateForm!.get('fileSource')!.value!);
    const headers = new HttpHeaders().append(
      'Content-Disposition',
      'multipart/form-data'
    );
    let params = new HttpParams()
      .set('StartDate', this.courseCreateForm.get('startDate')!.value!)
      .set('EndDate', this.courseCreateForm.get('endDate')!.value!);

    let submitResult = this.courseService
      .submitCourse(formData, params, headers)
      
    submitResult.subscribe((result) => {
        if (result.succes) {
          this.submitResult = `Created ${result.createdCourseInstances} course instances and created ${result.createdCourses} courses. Found ${result.duplicateCourseInstances} duplicate course instances.`;
        } else {
          this.submitError = `Something went wrong: ${result.errors}.\n${result.lineNrError > 0 ? 'Error on line ' + result.lineNrError : ''}`;
        }
        this.courseCreateForm.reset();
    });
  }
}

// Ergens dacht ik gelezen te hebben dat deze onderstaande eisen ook gelden voor de start en einddatum,
//maar ik kan het niet meer terugvinden. Ik heb het dus maar even uitgecomment.

// //start and end date can only be 5 days appart
// let startDate = new Date(this.courseCreateForm.get('startDate')!.value!)
// let endDate = new Date(this.courseCreateForm.get('endDate')!.value!)
// let diffTime = Math.abs(endDate.getTime() - startDate.getTime());
// let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// if(diffDays > 5){
//   this.submitError = 'Start and end date can only be 5 days appart'
//   return
// }
// //start and end date must be in one week ma-vr
// if(startDate.getDay() < 1 || startDate.getDay() > 5 || endDate.getDay() < 1 || endDate.getDay() > 5){
//   this.submitError = 'Start and end date must be in one week ma-vr'
//   return
// }
