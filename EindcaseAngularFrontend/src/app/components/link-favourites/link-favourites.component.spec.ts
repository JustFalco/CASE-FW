import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkFavouritesComponent } from './link-favourites.component';

describe('LinkFavouritesComponent', () => {
  let component: LinkFavouritesComponent;
  let fixture: ComponentFixture<LinkFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkFavouritesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
