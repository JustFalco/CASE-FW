import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentApiService } from 'src/app/services/APIs/student-api.service';
import { CreateStudentDTO } from 'src/app/models/create-student-dto';
import { CourseApiService } from 'src/app/services/APIs/course-api.service';
import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent {
  @Input("instanceId") instanceId?: number
  @Output() updateListEvent = new EventEmitter<Student>();
  newStudentForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
  });

  constructor(private studentService: StudentApiService, private courseService: CourseApiService){}

  submitStudent(){
    let firstName = this.newStudentForm.get("firstName")?.value
    let lastName = this.newStudentForm.get('lastName')?.value
    if(!this.instanceId){
      console.error("Cannot submit student, invalid course instance id!")
      return;
    }
    if(!firstName || !lastName){
      console.error("Cannot submit student, invalid first or last name!")
      return;
    }

    let studentDto: CreateStudentDTO = {
      FirstName: firstName,
      LastName: lastName,
      CourseInstanceId: this.instanceId
    }

    this.updateListEvent.emit({firstName, lastName})

    this.studentService.postStudent(studentDto)
    this.newStudentForm.reset()
  }
}
