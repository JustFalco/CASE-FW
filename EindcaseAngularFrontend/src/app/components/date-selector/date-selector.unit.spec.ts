import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockInstance, MockProvider } from "ng-mocks";
import { async, BehaviorSubject, EMPTY, Observable, of } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { DateStoreService } from "src/app/services/date-store.service";
import { DateSelectorComponent } from "./date-selector.component";

describe('DateSelectorComponent', () => {
    let sut: DateSelectorComponent;
    let fixture: ComponentFixture<DateSelectorComponent>;
    let dateServiceMock: jasmine.SpyObj<DateStoreService>;

    beforeEach((() => {
        TestBed.configureTestingModule({
            declarations: [DateSelectorComponent],
            imports: [HttpClientTestingModule, AppRoutingModule, ReactiveFormsModule],
            providers: [MockProvider(DateStoreService, {
                weekObs: of(1),
                yearObs: of(2021),
            })]
        })

        dateServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;


        fixture = TestBed.createComponent(DateSelectorComponent);
        sut = fixture.componentInstance;
        sut.ngOnInit();

    }));

    it("should create", () => {
        expect(sut).toBeTruthy();
    });

    it("should go to next week", () => {
        expect(sut.week).toBe(1);
        sut.nextWeek();
        expect(dateServiceMock.nextWeek).toHaveBeenCalled();
    });

    it("should go to previous week", () => {
        expect(sut.week).toBe(1);
        sut.prefWeek();
        expect(dateServiceMock.prefWeek).toHaveBeenCalled();
    });

    it("should set date", () => {
        expect(sut.week).toBe(1);
        expect(sut.year).toBe(2021);
        sut.dateEditForm.patchValue({
            weekInput: 2,
            yearInput: 2022,
        });
        sut.setDate();
        expect(dateServiceMock.setWeek).toHaveBeenCalled();
        expect(dateServiceMock.setYear).toHaveBeenCalled();
    });
});