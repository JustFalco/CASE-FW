import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { DateStoreService } from './date-store.service';

describe('DateStore service', () => {
  let sut: DateStoreService;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MockProvider(ActivatedRoute, {
				queryParams: of(convertToParamMap({
					week: undefined,
					year: undefined
				}))
			}), MockProvider(Router)],
    });
    activatedRouteMock = TestBed.inject(
      ActivatedRoute
    ) as jasmine.SpyObj<ActivatedRoute>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    sut = TestBed.inject(DateStoreService);
  });

  it('should be created', () => {
    expect(sut).toBeTruthy();
  });

  it('should calculate year if year is not in query params', () => {
    activatedRouteMock.queryParams = new BehaviorSubject({}).asObservable();
    let year = new Date().getFullYear();

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(year);
    });

    sut.getQueryParams();
  });

  it('should calculate week if week is not in query params', () => {
    let currentDate: any = new Date();
    let startDate: any = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let week = Math.ceil(days / 7);
		
		sut.getQueryParams();

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(week);
    });
  });

	it('should set week if week is in query params', () => {
		activatedRouteMock.queryParams = new BehaviorSubject({week: 1}).asObservable();

		sut.getQueryParams();

		sut.weekObs.subscribe((weekObs) => {
			expect(weekObs).toEqual(1);
		});
	});

	it('should set year if year is in query params', () => {
		activatedRouteMock.queryParams = new BehaviorSubject({year: 2023}).asObservable();

		sut.getQueryParams();

		sut.yearObs.subscribe((yearObs) => {
			expect(yearObs).toEqual(2023);
		});
	});

  it("should set the week", () => {
    sut.setWeek(10);

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(10);
    });
  });

  it("should set the year", () => {
    sut.setYear(2023);

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(2023);
    });
  });

  it("should go back one year if week is 1", () => {
    sut.setYear(2023);
    sut.setWeek(1);

    sut.prefWeek();

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(2022);
    });

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(52);
    });
  });

  it("should go back one week if week is not 1", () => {
    sut.setYear(2023);
    sut.setWeek(2);

    sut.prefWeek();

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(2023);
    });

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(1);
    });
  });

  it("should go forward one year if week is 52", () => {
    sut.setYear(2023);
    sut.setWeek(52);

    sut.nextWeek();

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(2024);
    });

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(1);
    });
  });

  it("should go forward one week if week is not 52", () => {
    sut.setYear(2023);
    sut.setWeek(51);

    sut.nextWeek();

    sut.yearObs.subscribe((yearObs) => {
      expect(yearObs).toEqual(2023);
    });

    sut.weekObs.subscribe((weekObs) => {
      expect(weekObs).toEqual(52);
    });
  });
});
