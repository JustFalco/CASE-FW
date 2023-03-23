import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockProvider } from "ng-mocks";
import { async, of } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { DateStoreService } from "src/app/services/date-store.service";
import { DateSelectorComponent } from "./date-selector.component";

describe('DateSelectorComponent', () => {
    let sut: DateSelectorComponent;
    let fixture: ComponentFixture<DateSelectorComponent>;
    let dateServiceMock: jasmine.SpyObj<DateStoreService>;

    beforeEach((async () => {
        await TestBed.configureTestingModule({
            declarations: [DateSelectorComponent],
            imports: [HttpClientTestingModule, AppRoutingModule, ReactiveFormsModule],
            providers: [MockProvider(DateStoreService, {
                weekObs: of(1),
                yearObs: of(2023),
            })]
        }).compileComponents();

        dateServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;
        fixture = TestBed.createComponent(DateSelectorComponent);
        sut = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(sut).toBeTruthy();
    });

    it("should show week input when clicking on week span", () => {
        expect(fixture.nativeElement.querySelector("#weekInput")).toBeFalsy();
        const weekSpan = fixture.nativeElement.querySelector("#week-span");
        weekSpan.click();
        fixture.detectChanges();
        const weekInput = fixture.nativeElement.querySelector("#weekInput");
        expect(weekInput).toBeTruthy();
    });

    it("should show year input when clicking on year span", () => {
        expect(fixture.nativeElement.querySelector("#yearInput")).toBeFalsy();
        const yearSpan = fixture.nativeElement.querySelector("#year-span");
        yearSpan.click();
        fixture.detectChanges();
        const yearInput = fixture.nativeElement.querySelector("#yearInput");
        expect(yearInput).toBeTruthy();
    });

    it("should update week when next week button is clicked", () => {
        expect(sut.week).toBe(1);
        const nextWeekButton = fixture.nativeElement.querySelector("#nextWeekBtn");
        nextWeekButton.click();
        fixture.detectChanges();
        expect(dateServiceMock.nextWeek).toHaveBeenCalled();
    });

    it("should update week when previous week button is clicked", () => {
        expect(sut.week).toBe(1);
        const prefWeekButton = fixture.nativeElement.querySelector("#prefWeekBtn");
        prefWeekButton.click();
        fixture.detectChanges();
        expect(dateServiceMock.prefWeek).toHaveBeenCalled();
    });

    it("should submit form when enter is pressed", () => {
        expect(sut.week).toBe(1);
        expect(sut.year).toBe(2023);

        const weekSpan = fixture.nativeElement.querySelector("#week-span");
        weekSpan.click();
        const yearSpan = fixture.nativeElement.querySelector("#year-span");
        yearSpan.click();

        fixture.detectChanges();

        const weekInput = fixture.nativeElement.querySelector("#weekInput");
        weekInput.value = 2;
        weekInput.dispatchEvent(new Event("input"));

        const yearInput = fixture.nativeElement.querySelector("#yearInput");
        yearInput.value = 2022;
        yearInput.dispatchEvent(new Event("input"));

        fixture.detectChanges();

        const form = fixture.nativeElement.querySelector("#dateEditForm");
        form.dispatchEvent(new Event("submit"));
        fixture.detectChanges();

        
        expect(dateServiceMock.setWeek).toHaveBeenCalled();
        expect(dateServiceMock.setYear).toHaveBeenCalled();
    });
});