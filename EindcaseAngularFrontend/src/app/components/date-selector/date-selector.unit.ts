import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MockInstance, MockProvider } from "ng-mocks";
import { async, BehaviorSubject, EMPTY, Observable } from "rxjs";
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
            imports: [HttpClientModule, AppRoutingModule, ReactiveFormsModule],
            providers: [MockProvider(DateStoreService)]
        })

        dateServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;
        
        fixture = TestBed.createComponent(DateSelectorComponent);
        sut = fixture.componentInstance;

    }));

    it("should create", () => {
        expect(sut).toBeTruthy();
    });

    it("should go to next week", () => {
        sut.nextWeek();
        expect(dateServiceMock.nextWeek).toHaveBeenCalled();
    });

});