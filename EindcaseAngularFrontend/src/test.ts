import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ngMocks } from 'ng-mocks';
import { BehaviorSubject } from 'rxjs';
import { DateStoreService } from './app/services/date-store.service';

declare const require: any;

ngMocks.autoSpy('jasmine');

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
	errorOnUnknownElements: true,
	errorOnUnknownProperties: true,
});