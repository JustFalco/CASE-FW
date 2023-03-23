import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { async } from "rxjs";
import { DateStoreService } from "src/app/services/date-store.service";
import { DateSelectorComponent } from "./date-selector.component";

describe('DateSelectorComponent', () => {
    let sut: DateSelectorComponent;
    let fixture: ComponentFixture<DateSelectorComponent>;
    let dateServiceMock: jasmine.SpyObj<DateStoreService>;

    beforeEach((async () => {
        await TestBed.configureTestingModule({
            declarations: [DateSelectorComponent],
            providers: [MockProvider(DateStoreService)]
        }).compileComponents();

        dateServiceMock = TestBed.inject(DateStoreService) as jasmine.SpyObj<DateStoreService>;
        fixture = TestBed.createComponent(DateSelectorComponent);
        sut = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it("should create", () => {
        expect(sut).toBeTruthy();
    });
});