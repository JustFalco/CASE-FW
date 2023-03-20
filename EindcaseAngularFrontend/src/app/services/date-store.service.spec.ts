import { TestBed } from '@angular/core/testing';

import { DateStoreService } from './date-store.service';

describe('DateStoreService', () => {
  let service: DateStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
