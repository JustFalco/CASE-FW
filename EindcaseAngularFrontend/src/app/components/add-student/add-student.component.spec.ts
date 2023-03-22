import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { StudentApiService } from 'src/app/services/APIs/student-api.service';

import { AddStudentComponent } from './add-student.component';

describe('AddStudentComponent', () => {
  let sut: AddStudentComponent;
  let fixture: ComponentFixture<AddStudentComponent>;
  let studentServiceMock: jasmine.SpyObj<StudentApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStudentComponent ],
      imports: [HttpClientModule, AppRoutingModule, ReactiveFormsModule],
      providers: [MockProvider(StudentApiService)]
    })
    

    studentServiceMock = TestBed.inject(StudentApiService) as jasmine.SpyObj<StudentApiService>;

    fixture = TestBed.createComponent(AddStudentComponent);
    sut = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(sut).toBeTruthy();
  });

  it('should have a form with two inputs', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('form')).toBeTruthy();
    expect(compiled.querySelector('input')).toBeTruthy();
    expect(compiled.querySelectorAll('input').length).toBe(2);
  });

  it("should show reset button when input is dirty", () => {
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input');
    input.value = "test";
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('#resetButton')).toBeTruthy();
  });

  it("should not show reset button when input is not dirty", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#resetButton')).toBeFalsy();
  });

  it("should enable submit button when form is valid", () => {
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input');
    input.value = "test";
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(compiled.querySelector('#submitButton').disabled).toBeFalsy();
  });

  it("should disable submit button when form is invalid", () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#submitButton').disabled).toBeTruthy();
  });

  


});
