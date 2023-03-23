import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CreateCourseInstanceResponse } from "src/app/models/create-course-instance-response";
import { CourseApiService } from "src/app/services/APIs/course-api.service";
import { CreateCourseComponent } from "./create-course.component";

describe('CreateCourseComponent', () => {
    let sut: CreateCourseComponent;
    let fixture: ComponentFixture<CreateCourseComponent>;
    let courseApiServiceMock: jasmine.SpyObj<CourseApiService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
        declarations: [CreateCourseComponent],
        imports: [
            ReactiveFormsModule, 
            AppRoutingModule, 
            HttpClientTestingModule],
        providers: [MockProvider(CourseApiService)]
        })

        courseApiServiceMock = TestBed.inject(CourseApiService) as jasmine.SpyObj<CourseApiService>;


        fixture = TestBed.createComponent(CreateCourseComponent);
        sut = fixture.componentInstance;


    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });

    it("should use the courseApiService to submit a course", () => {
        sut.courseCreateForm.get('files')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.get('fileSource')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.controls['startDate'].setValue('2021-05-01');
        sut.courseCreateForm.controls['endDate'].setValue('2021-05-02');
        
        courseApiServiceMock.submitCourse.and.returnValue(new Observable());
        
        sut.submitCourse();

        expect(courseApiServiceMock.submitCourse).toHaveBeenCalled();
    });

    it("should set a success message when the course is submitted", () => {
        sut.courseCreateForm.get('files')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.get('fileSource')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.controls['startDate'].setValue('2021-05-01');
        sut.courseCreateForm.controls['endDate'].setValue('2021-05-02');
        
        const createCourseInstanceResponse = {
            succes: true,
            errors: [],
            messages: [],
            createdCourses: 1,
            createdCourseInstances: 1,
            duplicateCourseInstances: 0,
            lineNrError: 0
        };

        const expectedResult = `Created ${createCourseInstanceResponse.createdCourseInstances} course instances and created ${createCourseInstanceResponse.createdCourses} courses. Found ${createCourseInstanceResponse.duplicateCourseInstances} duplicate course instances.`

        courseApiServiceMock.submitCourse.and.returnValue(new BehaviorSubject<CreateCourseInstanceResponse>(createCourseInstanceResponse));
        
        sut.submitCourse();

        expect(sut.submitResult).toBe(expectedResult);
    });

    it("should set a submit error message when the course is submitted and there are errors", () => {
        sut.courseCreateForm.get('files')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.get('fileSource')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.controls['startDate'].setValue('2021-05-01');
        sut.courseCreateForm.controls['endDate'].setValue('2021-05-02');
        
        const createCourseInstanceResponse = {
            succes: false,
            errors: ["error"],
            messages: [],
            createdCourses: 0,
            createdCourseInstances: 0,
            duplicateCourseInstances: 0,
            lineNrError: 2
        };

        const expectedResult =  `Something went wrong: ${createCourseInstanceResponse.errors}.\n${createCourseInstanceResponse.lineNrError > 0 ? 'Error on line ' + createCourseInstanceResponse.lineNrError : ''}`

        courseApiServiceMock.submitCourse.and.returnValue(new BehaviorSubject<CreateCourseInstanceResponse>(createCourseInstanceResponse));
        
        sut.submitCourse();

        expect(sut.submitError).toBe(expectedResult);
    });

});