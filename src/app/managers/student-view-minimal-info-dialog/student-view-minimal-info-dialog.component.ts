import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-student-view-minimal-info-dialog',
  templateUrl: './student-view-minimal-info-dialog.component.html',
  styleUrls: ['./student-view-minimal-info-dialog.component.css']
})
export class StudentViewMinimalInfoDialogComponent implements OnInit {
  public formattedDateOfBirth: string = '';
  public studentReg: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public dialogRef: MatDialogRef<StudentViewMinimalInfoDialogComponent>) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.formattedDateOfBirth = Utils.reformatDateOfBirth(this.data.studentsData.dob);
    this.studentReg = Utils.getRegistrationNumber(this.data.studentsData.am);
  }
}
