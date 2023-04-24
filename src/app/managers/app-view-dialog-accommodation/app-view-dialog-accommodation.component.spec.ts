import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewDialogAccommodationComponent } from './app-view-dialog-accommodation.component';

describe('AppViewDialogAccommodationComponent', () => {
  let component: AppViewDialogAccommodationComponent;
  let fixture: ComponentFixture<AppViewDialogAccommodationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppViewDialogAccommodationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppViewDialogAccommodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
