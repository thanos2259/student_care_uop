import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from 'src/app/students/student.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { ManagerService } from '../manager.service';
import { StudentApplication } from 'src/app/students/student-application.model';
import { EditNotesDialogComponent } from '../edit-notes-dialog/edit-notes-dialog.component';
import { AppViewDialogComponent } from '../app-view-dialog/app-view-dialog.component';
import { StudentViewDialogComponent } from '../student-view-dialog/student-view-dialog.component';
import * as XLSX from 'xlsx';
import { FilesMeals } from 'src/app/students/files-meals.model';

@Component({
  selector: 'app-manager-meals',
  templateUrl: './manager-meals.component.html',
  styleUrls: ['./manager-meals.component.css']
})
export class ManagerMealsComponent implements OnInit {
  @ViewChild('processingTable') private table1: DataTables.Api | undefined;
  @ViewChild('selectedYearMea') selectedYearMea: ElementRef | undefined;
  public state: number = 0;
  public studentsSSOData: StudentApplication[] = [];
  public formattedDate: string[] = [];
  private hasMadeComment = [];
  public modelMealsSelectedYear: string | null = null;
  public acyears = null;
  private isSpecialCategory: boolean = false;
  public filesMeals: FilesMeals = {
    eka8aristiko: false,
    oikogeneiakhKatastasi: false,
    pistopoihtikoGoneaFoithth: false,
    tautotita: false,
    toposMonimhsKatoikias: false,
    ypeu8unhDilosi: false,
    polutekneia: false,
    bebaioshSpoudonAderfwn: false,
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

  constructor(public studentsService: StudentsService, public authService: AuthService, public dialog: MatDialog, private chRef: ChangeDetectorRef, public managerService: ManagerService) { }

  ngOnInit(): void {
    this.managerService.getAcademicYearsOrdered('meals')
      .subscribe((years: any[]) => {
        this.acyears = years;
        if (this.acyears && this.acyears.length > 0) {
          this.modelMealsSelectedYear = years[0].acyear;
        }
        else return;
        this.studentsService.getStudentsAppsMealsForYear(Number(years[0].acyear))
          .subscribe((students: StudentApplication[]) => {
            this.studentsSSOData = Utils.sortArrayOfDepartments(students);

            for (let i = 0; i < students.length; i++) {
              this.studentsSSOData[i].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[i].schacpersonaluniquecode);
              this.formattedDate[i] = Utils.getPreferredTimestamp(this.studentsSSOData[i].submit_date);

              this.managerService.getCommentByStudentIdAndSubject(this.studentsSSOData[i].sso_uid, 'Σίτιση')
                .subscribe((comment: any) => {
                  if (comment) {
                    this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: true });
                  } else {
                    this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: false });
                  }
                });
            }

            // Initialize the DataTable with the new data
            this.initDataTable();
          });
      });
  }

  async exportToExcel() {
    let studentsDataJson: any = [];
    for (const item of this.studentsSSOData) {
      const itemIndex = this.studentsSSOData.indexOf(item);
      await this.getApplicationFilesData(item);
      const studentData = {
        "Α/Α": itemIndex + 1,
        "ΚΑΤΗΓΟΡΙΑ": this.isSpecialCategory ? "1" : "2",
        "TMHMA": this.getDepartmentNameById(Number(item.department_id)),
        "ΑΜ": item.schacpersonaluniquecode,
        "Επώνυμο": item.sn,
        "Όνομα": item.givenname,
        "Πατρώνυμο": item.father_name,
        "Μητρώνυμο": item.mother_name,
        "Επώνυμο πατέρα": item.father_last_name,
        "Επώνυμο μητέρας": item.mother_last_name,
        "email": item.mail,
        "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.schacdateofbirth),
        "Φύλο": item.schacgender == 1 ? 'Άνδρας' : 'Γυναίκα',
        "Τηλέφωνο": item.phone,
        "Πόλη": item.city,
        "ΤΚ": item.post_address,
        "Διεύθυνση": item.address,
        "Τοποθεσία": item.location,
        "Χώρα": item.country == "gr" ? 'Ελλάδα' : item.country,
        "Αρ. Αίτησης": item.id,
        "Ημ/νία Αίτησης": Utils.getPreferredTimestamp(item.submit_date),
        "Κατηγορία": item.category,
        "Οικογενειακό εισόδημα": item.family_income,
        "Όριο Εισοδηματος": this.calculateIncomeLimitForStudent(itemIndex),
        "Οικογενειακή κατάσταση": item.family_state,
        "Προστατευόμενα Μέλη": item.protected_members,
        "Αδέλφια που φοιτούν": item.siblings_students,
        "Παιδιά Φοιτητή": item.children,
        "Πολυτεκνεία": this.filesMeals.polutekneia ? 'ΝΑΙ' : 'OXI',
        "Τρίτεκνος ή Φοιτητής γονέας": this.filesMeals.pistopoihtikoGoneaFoithth ? 'ΝΑΙ' : 'OXI',
        "Αδέρφια φοιτητές": this.filesMeals.bebaioshSpoudonAderfwn ? 'ΝΑΙ' : 'OXI',
        "Άγαμη Μητέρα": this.filesMeals.agamhMhtera ? 'ΝΑΙ' : 'OXI',
        "Αποθνήσκων γονέας": this.filesMeals.lhksiarxikhPrakshThanatouGoneaA || this.filesMeals.lhksiarxikhPrakshThanatouGoneaB ? 'ΝΑΙ' : 'OXI',
        "Γονείς ΑΜΕΑ": this.filesMeals.goneisAMEA || this.filesMeals.goneisAMEAIatrikhGnomateush ? 'ΝΑΙ' : 'OXI',
        "Γονείς Θύματα Τρομοκρατίας": this.filesMeals.goneisThumataTromokratias1 || this.filesMeals.goneisThumataTromokratias2 ? 'ΝΑΙ' : 'OXI',
        "Άνεργος/η": this.filesMeals.bebaioshEpidothsdhsAnergeias ? 'ΝΑΙ' : 'OXI',
        "Διαζευγμένοι Γονείς": this.filesMeals.diazevgmenoiGoneis1 || this.filesMeals.diazevgmenoiGoneis2 ? 'ΝΑΙ' : 'OXI',
        "Φοιτητής / ρια ΑΜΕΑ": this.filesMeals.AMEA || this.filesMeals.AMEAIatrikhGnomateush ? 'ΝΑΙ' : 'OXI'
      };
      studentsDataJson.push(studentData);
    }
    const excelFileName: string = "StudentsPhase1Meals.xlsx";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* Save to file */
    XLSX.writeFile(wb, excelFileName);
  }

  async getApplicationFilesData(item: StudentApplication) {
    this.isSpecialCategory = false;
    return new Promise<any> (resolve => {
      this.studentsService.getAccommodationFiles(item.app_id)
        .subscribe((appFiles: any[]) => {
          for (let item of appFiles) {
            console.log(item);

            if (item.value == true && item.type === "optional") {
              this.isSpecialCategory = true;
            }

            if (item.name == 'filePolutekneia') {
              this.filesMeals.polutekneia = true;
            } else if (item.name == 'filePistopoihtikoGoneaFoithth') {
              this.filesMeals.pistopoihtikoGoneaFoithth = true;
            } else if (item.name == 'fileBebaioshSpoudonAderfwn') {
              this.filesMeals.bebaioshSpoudonAderfwn = true;
            } else if (item.name == 'fileAgamhMhtera') {
              this.filesMeals.agamhMhtera = true;
            } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaA') {
              this.filesMeals.lhksiarxikhPrakshThanatouGoneaA = true;
            } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaB') {
              this.filesMeals.lhksiarxikhPrakshThanatouGoneaB = true;
            } else if (item.name == 'fileGoneisAMEA') {
              this.filesMeals.goneisAMEA = true;
            } else if (item.name == 'fileGoneisAMEAIatrikhGnomateush') {
              this.filesMeals.goneisAMEAIatrikhGnomateush = true;
            } else if (item.name == 'fileGoneisThumataTromokratias1') {
              this.filesMeals.goneisThumataTromokratias1 = true;
            } else if (item.name == 'fileGoneisThumataTromokratias2') {
              this.filesMeals.goneisThumataTromokratias2 = true;
            } else if (item.name == 'fileBebaioshEpidothsdhsAnergeias') {
              this.filesMeals.bebaioshEpidothsdhsAnergeias = true;
            } else if (item.name == 'fileDiazevgmenoiGoneis1') {
              this.filesMeals.diazevgmenoiGoneis1 = true;
            } else if (item.name == 'fileDiazevgmenoiGoneis2') {
              this.filesMeals.diazevgmenoiGoneis2 = true;
            } else if (item.name == 'fileAMEA') {
              this.filesMeals.AMEA = true;
            } else if (item.name == 'fileAMEAIatrikhGnomateush') {
              this.filesMeals.AMEAIatrikhGnomateush = true;
            }
          }
          // Resolve the promise with the filesMeals object.
          resolve(this.filesMeals);
        });
    });
  }

  receiveZipFileMeals(studentId: number, docType: string) {
    this.studentsService.receiveZipFileMeals(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  openCommentsDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: idx, subject: 'Σίτιση' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAppViewDialog(idx: number, appId: number) {
    console.log(idx);
    const dialogRef = this.dialog.open(AppViewDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: idx, appId: appId },
      width: '850px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  studentInfo(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(StudentViewDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateNotesDialog(appId: number, notes: string) {
    console.log(appId);
    const dialogRef = this.dialog.open(EditNotesDialogComponent, {
      data: { notes: notes, appId: appId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // Re-fetch the student data to update notes etc.
      if (this.state == 0) {
        this.fetchCurrectAppData(0);
      } else if (this.state == 1) {
        this.fetchOldAppData(1);
      }
    });
  }

  calculateIncomeLimitForStudent(index: number) {
    return Utils.calculateIncomeLimitForMealEligibility(this.studentsSSOData[index]);
  }

  getYearValueOnChange(eventValue: any) {
    this.modelMealsSelectedYear = eventValue.split("-")[0];
    console.log(this.modelMealsSelectedYear);
    this.fetchCurrectAppData(0, Number(this.modelMealsSelectedYear));
  }

  getDepartmentNameById(depId: number) {
    return Utils.departmentsMap[depId];
  }

  getDepartmentCityByDepId(depId: any) {
    return Utils.getCityByDepartmentId(depId);
  }

  onSubmitSelect(option: string, appId: number) {
    let status = (option == "option1") ? 1 : (option == "option2") ? -1 : 0;
    this.managerService.updateApplicationStatus(status, appId);
  }

  checkStudentHasComment(studentSSOUid: number): boolean {
    const studentComment = this.hasMadeComment.find((comment: { studentId: number; hasComment: boolean }) => comment.studentId === studentSSOUid);
    return (studentComment && studentComment.hasComment);
  }

  fetchOldAppData(state: number) {
    this.state = state;
    this.studentsSSOData = [];
    $('#processingTable').DataTable().destroy();

    this.studentsService.getOldStudentsAppsForMeals()
      .subscribe((students: StudentApplication[]) => {
        this.studentsSSOData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsSSOData[i].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[i].schacpersonaluniquecode);
          this.formattedDate[i] = Utils.getPreferredTimestamp(this.studentsSSOData[i].submit_date);

          this.managerService.getCommentByStudentIdAndSubject(this.studentsSSOData[i].sso_uid, 'Σίτιση')
            .subscribe((comment: any) => {
              if (comment) {
                this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: true });
              } else {
                this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: false });
              }
            });
        }

        // Reinitialize the DataTable with the new data
        this.initDataTable();
      });
  }

  initDataTable(): void {
    this.chRef.detectChanges();
    const table: any = $('#processingTable');
    this.table1 = table.DataTable({
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, 'All']
      ],
      lengthChange: true,
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
      select: true,
      pagingType: 'full_numbers',
      processing: true,
      columnDefs: [{ orderable: false, targets: [0, 7, 10] }],
      language: {
        emptyTable: "Δεν υπάρχουν αιτήσεις φοιτητών"
      }
    });
  }

  fetchCurrectAppData(state: number, year: number = null) {
    this.state = state;
    this.studentsSSOData = [];
    $('#processingTable').DataTable().destroy();

    this.studentsService.getStudentsAppsMealsForYear(year ?? 1980)
      .subscribe((students: StudentApplication[]) => {
        this.studentsSSOData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsSSOData[i].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[i].schacpersonaluniquecode);
          this.formattedDate[i] = Utils.getPreferredTimestamp(this.studentsSSOData[i].submit_date);

          this.managerService.getCommentByStudentIdAndSubject(this.studentsSSOData[i].sso_uid, 'Σίτιση')
            .subscribe((comment: any) => {
              if (comment) {
                this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: true });
              } else {
                this.hasMadeComment.push({ studentId: this.studentsSSOData[i].sso_uid, hasComment: false });
              }
            });
        }

        // Reinitialize the DataTable with the new data
        this.initDataTable();
      });
  }

}
