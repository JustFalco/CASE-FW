import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { CreateStudentDTO } from "src/app/models/create-student-dto";
import { DateStoreService } from "../date-store.service";
import { CourseApiService } from "./course-api.service";
import { StudentApiService } from "./student-api.service";

describe('Student API', () => {
    let sut: StudentApiService;
    let httpMock: HttpTestingController;
    let courseServiceMock: jasmine.SpyObj<CourseApiService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MockProvider(CourseApiService)],
        });

        courseServiceMock = TestBed.inject(CourseApiService) as jasmine.SpyObj<CourseApiService>;

        sut = TestBed.inject(StudentApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should post student', () => {
        const expectedStudent: CreateStudentDTO = {
            FirstName: 'Test',
            LastName: 'Test',
            CourseInstanceId: 1
        };

        sut.postStudent(expectedStudent);

        const req = httpMock.expectOne('https://localhost:7010/api/student');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(expectedStudent);
        req.flush(expectedStudent);
        expect(courseServiceMock.getCourses).toHaveBeenCalled();
    });
});