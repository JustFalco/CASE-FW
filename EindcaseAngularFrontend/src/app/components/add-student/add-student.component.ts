import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentApiService } from 'src/app/services/APIs/student-api.service';
import { CreateStudentDTO } from 'src/app/models/create-student-dto';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';
import { Student } from 'src/app/models/student';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent{
  submitResult?: string = "";
  submitError?: string = "";
  postSubscription?:Subscription
  @Input("instanceId") instanceId?: number
  @Output() updateListEvent = new EventEmitter<Student>();
  newStudentForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  constructor(private studentService: StudentApiService, private courseService: CourseApiService){}

  submitStudent(){
    this.submitResult = ""
    this.submitError = ""
    let firstName = this.newStudentForm.get("firstName")?.value
    let lastName = this.newStudentForm.get('lastName')?.value
    if(!this.instanceId){
      //TODO add error message to page
      console.error("Cannot submit student, invalid course instance id!")
      return;
    }
    if(!firstName || !lastName){
      //TODO add error message to page
      console.error("Cannot submit student, invalid first or last name!")
      return;
    }

    let studentDto: CreateStudentDTO = {
      FirstName: firstName,
      LastName: lastName,
      CourseInstanceId: this.instanceId
    } 

    

    this.postSubscription = this.studentService.postStudent(studentDto).subscribe((result) => {
      console.log(JSON.stringify(result))
      if(result.succes){
        this.courseService.getCourses()
        const firstName = result.createdStudent.firstName
        const lastName = result.createdStudent.lastName
        this.updateListEvent.emit({firstName, lastName})
        console.log(result.messages)
        result.messages.forEach(element => {
          this.submitResult += element + ".\n\n"
        });
      }else{
        if(result.errors){
          result.errors.forEach(element => {
            this.submitError += element + "\n"
          });
        }
      }
    })
    this.newStudentForm.reset()
  }

  ngOnDestroy(): void {
    if(this.postSubscription){
      this.postSubscription.unsubscribe()
    }
  }
}
