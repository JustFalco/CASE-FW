import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { Observable } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { StudentApiService } from "src/app/services/APIs/student-api.service";
import { AddStudentComponent } from "./add-student.component";

describe('AddStudentComponent', () => {
    let sut: AddStudentComponent;
    let fixture: ComponentFixture<AddStudentComponent>;
    let studentServiceMock: jasmine.SpyObj<StudentApiService>;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ AddStudentComponent ],
            imports: [HttpClientTestingModule, AppRoutingModule, ReactiveFormsModule],
            providers: [
                MockProvider(StudentApiService)
            ],
            teardown: {destroyAfterEach: false}
        })
        
        studentServiceMock = TestBed.inject(StudentApiService) as jasmine.SpyObj<StudentApiService>;
        studentServiceMock.postStudent.and.returnValue(new Observable());

        fixture = TestBed.createComponent(AddStudentComponent);
        sut = fixture.componentInstance;

    });
    
    it("should submit student to student service with valid input", () => {
        sut.newStudentForm.controls.firstName.setValue("Falco");
        sut.newStudentForm.controls.lastName.setValue("Wolkorte");
        sut.instanceId = 1;
    
        sut.submitStudent();
    
        expect(studentServiceMock.postStudent).toHaveBeenCalled();
    })

    it("should not submit student to student service with invalid instance id", () => {
        sut.newStudentForm.controls.firstName.setValue("Falco");
        sut.newStudentForm.controls.lastName.setValue("Wolkorte");
        sut.instanceId = undefined;
    
        sut.submitStudent();
    
        expect(studentServiceMock.postStudent).not.toHaveBeenCalled();
    });

    it("should not submit student to student service with invalid input", () => {
        sut.newStudentForm.controls.firstName.setValue("");
        sut.newStudentForm.controls.lastName.setValue("");
        sut.instanceId = 1;

        sut.submitStudent();

        expect(studentServiceMock.postStudent).not.toHaveBeenCalled();
    });
})