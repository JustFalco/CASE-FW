import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreatePageComponent } from './course-create-page.component';

describe('CourseCreatePageComponent', () => {
  let component: CourseCreatePageComponent;
  let fixture: ComponentFixture<CourseCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseCreatePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
