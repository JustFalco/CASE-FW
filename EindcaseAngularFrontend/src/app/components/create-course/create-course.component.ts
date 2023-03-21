import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css'],
})
export class CreateCourseComponent {
  submitResult?: string;

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
      const file = event.target.files[0];
      this.courseCreateForm.patchValue({
        fileSource: file,
      });
    }
  }

  submitCourse() {
    //all field required
    //file must be .txt
    //start and end date can only be 5 days appart
    //start and end date must be in one week ma-vr
    const formData = new FormData();
    formData.append('file', this.courseCreateForm!.get('fileSource')!.value!);
    const headers = new HttpHeaders().append(
      'Content-Disposition',
      'multipart/form-data'
    );
    let params = new HttpParams()
      .set('StartDate', this.courseCreateForm.get('startDate')!.value!)
      .set('EndDate', this.courseCreateForm.get('startDate')!.value!);

    this.http
      .post('https://localhost:7010/api/courses', formData, { headers, params, responseType: 'text'})
      .subscribe(
        (result) => {
          this.submitResult = result
          this.courseCreateForm.reset()
        }
      );
  }
}

export function requiredFileType(type: string) {
  return function (control: FormControl) {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (type.toLowerCase() !== extension.toLowerCase()) {
        return {
          requiredFileType: true,
        };
      }

      return null;
    }

    return null;
  };
}
