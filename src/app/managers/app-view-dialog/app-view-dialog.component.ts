import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Utils} from 'src/app/MiscUtils';
import {FilesMeals} from 'src/app/students/files-meals.model';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-app-view-dialog',
  templateUrl: './app-view-dialog.component.html',
  styleUrls: ['./app-view-dialog.component.css']
})
export class AppViewDialogComponent implements OnInit {
  appFiles!: any[];
  public filesMeals: FilesMeals = {
    eka8aristiko: false,
    oikogeneiakhKatastasi: false,
    pistopoihtikoGoneaFoithth: false,
    tautotita: false,
    toposMonimhsKatoikias: false,
    ypeu8unhDilosi: false,
    polutekneia: false,
    threeChildren: false,
    bebaioshSpoudonAderfwn: false,
    noParents: false,
    agamhMhtera: false,
    lhksiarxikhPrakshThanatouGoneaA: false,
    lhksiarxikhPrakshThanatouGoneaB: false,
    goneisAMEA: false,
    goneisAMEAIatrikhGnomateush: false,
    goneisThumataTromokratias1: false,
    goneisThumataTromokratias2: false,
    bebaioshEpidothsdhsAnergeias: false,
    diazevgmenoiGoneis1: false,
    diazevgmenoiGoneis2: false,
    AMEA: false,
    AMEAIatrikhGnomateush: false,
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppViewDialogComponent>, public studentService: StudentsService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  viewFile(filesMealsModelParam: string) {
    const MEALS_ABBR: 'mea' | 'acc' = 'mea';
    const studentId: number = this.data.studentsData[this.data.index].sso_uid;
    const appId: number = this.data.studentsData[this.data.index].app_id;
    const fileName: string = MEALS_ABBR + Utils.mapFilesMealsModelToFilenames[filesMealsModelParam];

    this.studentService.sendFileByType(studentId, fileName, MEALS_ABBR).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
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
            this.filesMeals.polutekneia = true;
          } else if (item.name == 'filePistopoihtikoGoneaFoithth') {
            this.filesMeals.pistopoihtikoGoneaFoithth = true;
          } else if (item.name == 'fileBebaioshSpoudonAderfwn') {
            this.filesMeals.bebaioshSpoudonAderfwn = true;
          } else if (item.name.includes('fileLhksiarxikhPrakshThanatouGonea')) {
            this.filesMeals.noParents = true;
          } else if (item.name == 'fileAgamhMhtera') {
            this.filesMeals.agamhMhtera = true;
          }
        }
      });
  }

}
