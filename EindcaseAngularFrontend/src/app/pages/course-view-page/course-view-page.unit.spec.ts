import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CourseListComponent } from "src/app/components/course-list/course-list.component";
import { DateSelectorComponent } from "src/app/components/date-selector/date-selector.component";
import { DateStoreService } from "src/app/services/date-store.service";

import { CourseViewPageComponent } from "./course-view-page.component";

describe('CourseViewPageComponent', () => {
    let sut: CourseViewPageComponent;
    let fixture: ComponentFixture<CourseViewPageComponent>;
    let dateStoreServiceMock: jasmine.SpyObj<DateStoreService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CourseViewPageComponent, DateSelectorComponent, CourseListComponent],
            imports: [
                ReactiveFormsModule, 
                AppRoutingModule, 
                HttpClientTestingModule],
            providers: [MockProvider(DateStoreService, {
                weekObs: of(12),
                yearObs: of(2023),
            })]
        });

        dateStoreServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;

        fixture = TestBed.createComponent(CourseViewPageComponent);
        sut = fixture.componentInstance;
    });

    it('should create', () => {
        expect(sut).toBeTruthy();
    });
});