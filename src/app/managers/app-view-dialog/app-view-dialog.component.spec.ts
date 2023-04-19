import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppViewDialogComponent } from './app-view-dialog.component';

describe('AppViewDialogComponent', () => {
  let component: AppViewDialogComponent;
  let fixture: ComponentFixture<AppViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppViewDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
