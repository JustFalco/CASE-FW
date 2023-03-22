import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CourseCardComponent } from "./course-card.component";

describe('CourseCardComponent', () => {
    let sut: CourseCardComponent;
    let fixture: ComponentFixture<CourseCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseCardComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CourseCardComponent);
        sut = fixture.componentInstance;

        sut.courseInstance = {
            id: 1,
            startDate: new Date(),
            students: [{firstName: "Falco", lastName: "Wolkorte"}, {firstName: "Jane", lastName: "Doe"}, {firstName: "John", lastName: "Doe"}],
            courseId: 1,
            course: {
                id: 1,
                title: "Test",
                amountOfDays: 5,
            }
        }
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });

    it("should list all students with their names", () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const students = compiled.querySelectorAll("tbody tr");
        sut.courseInstance?.students.forEach((student, index) => {
            expect(students[index].children[0].textContent).toBe(student.firstName);
            expect(students[index].children[1].textContent).toBe(student.lastName);
        });
    });
});