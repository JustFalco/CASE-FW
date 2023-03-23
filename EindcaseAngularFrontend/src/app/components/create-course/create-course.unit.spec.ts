import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { Observable } from "rxjs/internal/Observable";
import { AppRoutingModule } from "src/app/app-routing.module";
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
            HttpClientModule],
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
});