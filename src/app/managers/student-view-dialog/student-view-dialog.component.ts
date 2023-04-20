import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-student-view-dialog',
  templateUrl: './student-view-dialog.component.html',
  styleUrls: ['./student-view-dialog.component.css']
})
export class StudentViewDialogComponent implements OnInit {
  public formattedDateOfBirth: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentViewDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formattedDateOfBirth = Utils.reformatDateOfBirth(this.data.studentsData[this.data.index].schacdateofbirth);
  }

}
