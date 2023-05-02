import { Component, ElementRef, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-question-answer-dialog',
  templateUrl: './question-answer-dialog.component.html',
  styleUrls: ['./question-answer-dialog.component.css']
})
export class QuestionAnswerDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('answerTextArea') answerTextArea!: ElementRef;
  private answerText!: string;
  private questionId: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<QuestionAnswerDialogComponent>, public managerService: ManagerService
  ) { }

  onCommentSubmit(): void {
    // Get latest value from html element
    const answerTxt: string = this.answerTextArea.nativeElement.value;

    this.managerService.updateAnswerByQuestionId(answerTxt, this.questionId);

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.answerText = this.data.notes;
    this.questionId = this.data.questionId;
  }

  ngAfterViewInit(): void {
    if (this.answerText) {
      this.answerTextArea.nativeElement.value = this.answerText;
    }
  }
}
