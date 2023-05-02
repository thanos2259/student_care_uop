import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAnswerDialogComponent } from './question-answer-dialog.component';

describe('QuestionAnswerDialogComponent', () => {
  let component: QuestionAnswerDialogComponent;
  let fixture: ComponentFixture<QuestionAnswerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionAnswerDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAnswerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
