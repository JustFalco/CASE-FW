import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CourseListComponent } from "./course-list.component";

describe('CourseListComponent', () => {
    let sut: CourseListComponent;
    let fixture: ComponentFixture<CourseListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseListComponent],
            imports: [HttpClientModule, AppRoutingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CourseListComponent);
        sut = fixture.componentInstance;

        sut.courses = [
            {
                id: 1,
                startDate: new Date(),
                students: [{firstName: "Falco", lastName: "Wolkorte"}, {firstName: "Jane", lastName: "Doe"}, {firstName: "John", lastName: "Doe"}],
                courseId: 1,
                course: {
                    id: 1,
                    title: "Test",
                    amountOfDays: 5,
                }
            },
            {
                id: 2,
                startDate: new Date(),
                students: [{firstName: "Falco", lastName: "Wolkorte"}, {firstName: "Jane", lastName: "Doe"}, {firstName: "John", lastName: "Doe"}],
                courseId: 1,
                course: {
                    id: 1,
                    title: "Test",
                    amountOfDays: 5,
                }   
            }
        ]

    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });

    it("should list all courses with their title", () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const courses = compiled.querySelectorAll("tbody tr");
        sut.courses!.forEach((course, index) => {
            expect(courses[index].children[2].textContent).toBe(course.course.title);
        });
    });

    it("should list all courses with the amount of students", () => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        const courses = compiled.querySelectorAll("tbody tr");
        sut.courses!.forEach((course, index) => {
            expect(courses[index].children[3].textContent).toBe(course.students.length.toString() + " cursisten");
        });
    });

});