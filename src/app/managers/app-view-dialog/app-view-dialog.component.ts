import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-app-view-dialog',
  templateUrl: './app-view-dialog.component.html',
  styleUrls: ['./app-view-dialog.component.css']
})
export class AppViewDialogComponent implements OnInit {
  appFiles!: any[];
  public fiveChildrenModel: boolean = false;
  public threeChildrenModel: boolean = false;
  public siblingStudentModel: boolean = false;
  public noParentsModel: boolean = false;
  public unmarriedMotherModel: boolean = false;
  public specialIllnessModel: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppViewDialogComponent>, public studentService: StudentsService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  viewFile(studentId) {

  }

  ngOnInit(): void {
    this.studentService.getAccommodationFiles(this.data.appId)
      .subscribe((files: any[]) => {
        console.log(files);
        this.appFiles = files;
        for (let item of this.appFiles) {
          // console.log(item.description);
          if (!item.value) continue;

          if (item.name == 'filePolutekneia') {
            this.fiveChildrenModel = true;
          } else if (item.name == 'filePistopoihtikoGoneaFoithth') {
            this.threeChildrenModel = true;
          } else if (item.name == 'fileBebaioshSpoudonAderfwn') {
            this.siblingStudentModel = true;
          } else if (item.name.includes('fileLhksiarxikhPrakshThanatouGonea')) {
            this.noParentsModel = true;
          } else if (item.name == 'fileAgamhMhtera') {
            this.unmarriedMotherModel = true;
          }
        }
      });
  }

}
