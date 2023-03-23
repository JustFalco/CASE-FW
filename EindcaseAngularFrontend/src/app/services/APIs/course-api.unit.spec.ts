import { HttpParams, HttpHeaders } from "@angular/common/http";
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { CreateCourseInstanceResponse } from "src/app/models/create-course-instance-response";
import { DateStoreService } from "../date-store.service";
import { CourseApiService } from "./course-api.service";

describe('Course API', () => {
    let sut: CourseApiService;
    let httpMock: HttpTestingController;
    let dateServiceMock: jasmine.SpyObj<DateStoreService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CourseApiService, MockProvider(DateStoreService, {
                weekObs: of(1),
                yearObs: of(2023),
            })],
        });

        dateServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;

        sut = TestBed.inject(CourseApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should get courses if week and year are set', done => {
        sut.week = 1;
        sut.year = 2023;

        const expectedCouseInstances = [
            {
                id: 1,
                startDate: new Date(),
                students: [],
                courseId: 1,
                course: {
                    id: 1,
                    title: 'Test Course',
                    amountOfDays: 1,
                }
            }
        ];

        sut.coursesObs.subscribe((courses) => {
            expect(courses).toEqual(expectedCouseInstances);
            done();
        });
        
        sut.getCourses();

        const req = httpMock.expectOne('https://localhost:7010/api/courses?week=1&year=2023');
        expect(req.request.method).toBe('GET');
        req.flush(expectedCouseInstances);
    });

    it('should not get courses if week is not set', () => {
        sut.week = undefined;
        sut.year = 2023;
        
        sut.getCourses();

        httpMock.expectNone('https://localhost:7010/api/courses?week=1&year=2023');
    });

    it("should submit course", done => {
        const formData = new FormData();
        formData.append('courseId', '1');
        formData.append('startDate', '2023-01-01');

        const params = new HttpParams()
            .set('week', '1')
            .set('year', '2023');

        const headers = new HttpHeaders()
            .set('Content-Type', 'multipart/form-data');

        const expectedResponse: CreateCourseInstanceResponse = {
            succes: true,
            errors:  [],
            messages: [],
            createdCourses:0,
            createdCourseInstances: 0,
            duplicateCourseInstances: 0,
            lineNrError: 0,
        };


        sut.submitCourse(formData, params, headers).subscribe((response) => {
            expect(response).toEqual(expectedResponse);
            done();
        });

        const req = httpMock.expectOne('https://localhost:7010/api/courses?week=1&year=2023');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(formData);
        expect(req.request.params).toEqual(params);
        expect(req.request.headers).toEqual(headers);
        req.flush(expectedResponse);
    });

    it("should get course instance by id", done => {
        const expectedCourseInstance = {
            id: 1,
            startDate: new Date(),
            students: [],
            courseId: 1,
            course: {
                id: 1,
                title: 'Test Course',
                amountOfDays: 1,
            }
        };

        sut.getCourseInstanceById(1).subscribe((courseInstance) => {
            expect(courseInstance).toEqual(expectedCourseInstance);
            done();
        });

        const req = httpMock.expectOne('https://localhost:7010/api/courses/1');
        expect(req.request.method).toBe('GET');
        req.flush(expectedCourseInstance);
    });

    it("should not get courses if week is not in range", () => {
        sut.week = 0;
        sut.year = 2023;

        sut.getCourses();

        sut.week = 54;
        sut.year = 2023;

        sut.getCourses();

        httpMock.expectNone('https://localhost:7010/api/courses?week=0&year=2023');
        httpMock.expectNone('https://localhost:7010/api/courses?week=54&year=2023');
    });
});