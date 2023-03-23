import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CourseApiService } from "src/app/services/APIs/course-api.service";
import { CreateCourseComponent } from "./create-course.component";

describe('CreateCourseComponent', () => {
    let sut: CreateCourseComponent;
    let fixture: ComponentFixture<CreateCourseComponent>;
    
    beforeEach(async () => {
        await TestBed.configureTestingModule({
        declarations: [CreateCourseComponent],
        imports: [
            ReactiveFormsModule, 
            AppRoutingModule, 
            HttpClientModule],
        providers: [CourseApiService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(CreateCourseComponent);
        sut = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });
    
    it('should have a form with 4 controls', () => {
        expect(sut.courseCreateForm.contains('files')).toBeTruthy();
        expect(sut.courseCreateForm.contains('fileSource')).toBeTruthy();
        expect(sut.courseCreateForm.contains('startDate')).toBeTruthy();
        expect(sut.courseCreateForm.contains('endDate')).toBeTruthy();
    });

    it("should set a submit error message when submitted with empty fields", () => {
        sut.submitCourse();
        fixture.detectChanges();

        expect(sut.submitError).toBe('All fields are required');
    });

    it("should set a submit error message when submitted with invalid date range", () => {
        sut.courseCreateForm.get('files')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.get('fileSource')?.setValue('test.txt', {emitModelToViewChange: false});
        sut.courseCreateForm.controls['startDate'].setValue('2021-05-01');
        sut.courseCreateForm.controls['endDate'].setValue('2021-04-01');
        sut.submitCourse();
        fixture.detectChanges();

        expect(sut.submitError).toBe('Start date must be before end date');
    });
});