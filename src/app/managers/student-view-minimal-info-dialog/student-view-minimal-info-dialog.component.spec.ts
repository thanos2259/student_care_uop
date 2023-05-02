import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewMinimalInfoDialogComponent } from './student-view-minimal-info-dialog.component';

describe('StudentViewMinimalInfoDialogComponent', () => {
  let component: StudentViewMinimalInfoDialogComponent;
  let fixture: ComponentFixture<StudentViewMinimalInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentViewMinimalInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentViewMinimalInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
