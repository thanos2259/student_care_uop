import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-student-view-dialog',
  templateUrl: './student-view-dialog.component.html',
  styleUrls: ['./student-view-dialog.component.css']
})
export class StudentViewDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentViewDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

  }

}
