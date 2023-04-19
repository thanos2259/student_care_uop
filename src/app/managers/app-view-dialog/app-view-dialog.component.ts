import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Application } from 'src/app/students/application.model';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-app-view-dialog',
  templateUrl: './app-view-dialog.component.html',
  styleUrls: ['./app-view-dialog.component.css']
})
export class AppViewDialogComponent implements OnInit {
  studentApplications: Application[];
  accommodationFiles!: any[];
  fileFieldsText: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppViewDialogComponent>, public studentService: StudentsService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.studentService.getApplication()
      .subscribe((applications: Application[]) => {
        this.studentApplications = applications;

        for (let i = 0; i < this.studentApplications.length; i++) {
          this.studentService.getAccommodationFiles(this.studentApplications[i].id)
            .subscribe((files: any[]) => {
              this.accommodationFiles = files;
              for (let j = 0; j < this.accommodationFiles.length; j++) {
                console.log(this.fileFieldsText[i]);
                console.log(this.accommodationFiles[j].description);
              }
            });
        }
      });
  }

}
