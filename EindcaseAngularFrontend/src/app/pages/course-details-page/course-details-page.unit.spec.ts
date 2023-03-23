import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject, Observable } from "rxjs";
import { AddStudentComponent } from "src/app/components/add-student/add-student.component";
import { CourseCardComponent } from "src/app/components/course-card/course-card.component";
import { PreviousPageButtonComponent } from "src/app/components/previous-page-button/previous-page-button.component";
import { CourseApiService } from "src/app/services/APIs/course-api.service";
import { CourseDetailsPageComponent } from "./course-details-page.component";

describe('CourseDetailsPage', () => {
    let sut: CourseDetailsPageComponent;
    let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
    let courseServiceMock: jasmine.SpyObj<CourseApiService>;
    let fixture: ComponentFixture<CourseDetailsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [CourseDetailsPageComponent, PreviousPageButtonComponent, CourseCardComponent, AddStudentComponent],
            providers: [
                MockProvider(ActivatedRoute),
                MockProvider(CourseApiService),
            ],
        })

        activatedRouteMock = TestBed.inject(
            ActivatedRoute
        ) as jasmine.SpyObj<ActivatedRoute>;
        courseServiceMock = TestBed.inject(
            CourseApiService
        ) as jasmine.SpyObj<CourseApiService>;

        fixture = TestBed.createComponent(CourseDetailsPageComponent);
        sut = fixture.componentInstance;
        
    });

    it('should be created', () => {
        expect(sut).toBeTruthy();
    });

    it("should update courseInstance students list when student is added", () => {
        sut.courseInstance = {
            id: 1,
            startDate: new Date(),
            students: [],
            courseId: 1,
            course: {
                id: 1,
                title: "Test",
                amountOfDays: 1,
            },
        };

        sut.updateInstanceStudentsList({
            firstName: "Falco",
            lastName: "Wolkorte",
        });

        expect(sut.courseInstance.students.length).toBe(1);
    });

    it("should get course instance from route params", () => {
        activatedRouteMock.params = new BehaviorSubject({id: 1}).asObservable();
        courseServiceMock.getCourseInstanceById.and.returnValue(new Observable());

        sut.ngOnInit();

        expect(courseServiceMock.getCourseInstanceById).toHaveBeenCalled();
    });
});