import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-comments-dialog',
  templateUrl: './comments-dialog.component.html',
  styleUrls: ['./comments-dialog.component.css']
})
export class CommentsDialogComponent implements OnInit {
  @ViewChild('commentsArea') commentsArea!: ElementRef;
  comment!: any;
  commentExistsInDatabase = false;
  subject = this.data.subject;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<CommentsDialogComponent>, public managerService: ManagerService
  ) { }

  onCommentSubmit(): void {
    // get value from html element
    const comments = this.commentsArea.nativeElement.value;

    // check if comments is null or empty or whiteSpace
    if (comments === null || comments === '' || comments.trim() === '') {
      alert('Το σχόλιο δεν μπορεί να είναι κενό');
      return;
    }

    if (this.commentExistsInDatabase) {
      // update comment
      this.managerService.updateCommentsByStudentId(this.data.studentsData[this.data.index].uuid, comments, this.subject);
    } else {
      // insert comment
      this.managerService.insertCommentsByStudentId(this.data.studentsData[this.data.index].uuid, comments, this.subject);
    }

    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.subject = this.data.subject;
    console.log('asd ' + this.subject);
    this.managerService.getCommentByStudentIdAndSubject(this.data.studentsData[this.data.index].uuid, this.subject)
      .subscribe((comment: any) => {
        if (comment) {
          this.comment = comment;
          this.commentsArea.nativeElement.value = this.comment.comment_text;
          this.commentExistsInDatabase = true;
        }
      });
  }

}
