import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from 'src/app/students/student.service';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { ManagerService } from '../manager.service';
import { StudentApplication } from 'src/app/students/student-application.model';

@Component({
  selector: 'app-manager-meals',
  templateUrl: './manager-meals.component.html',
  styleUrls: ['./manager-meals.component.css']
})
export class ManagerMealsComponent implements OnInit {

  @ViewChild('processingTable') table1: ElementRef | undefined;
  @ViewChild('completed') table2: ElementRef | undefined;

  studentsSSOData: StudentApplication[] = [];
  formattedDate: string[] = [];
  hasMadeComment = [];

  constructor(public studentsService: StudentsService, public authService: AuthService, public dialog: MatDialog, private chRef: ChangeDetectorRef, public managerService: ManagerService) { }

  ngOnInit(): void {
    this.studentsService.getStudentsAppsMealsForPeriod()
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
            // lengthMenu: 'Show _MENU_ entries'
            // lengthMenu: this.translate.instant('DEPT-MANAGER.SHOW-RESULTS') + ' _MENU_ ' + this.translate.instant('DEPT-MANAGER.ENTRIES')
            // : "Επίδειξη","ENTRIES": "εγγραφών ανά σελίδα"
            // // lengthMenu: 'Display _MENU_ records per page',
            // zeroRecords: 'Nothing found - sorry',
            // info: 'Showing page _PAGE_ of _PAGES_',
            // infoEmpty: 'No records available',
            // infoFiltered: '(filtered from _MAX_ total records)',
          },
          // pageLength: 8
        });

      });
  }

  exportToExcel() {

  }

  printDataTable() {

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

  departmentNameByid(depId: number) {
    return Utils.departmentsMap[depId];
  }

  onSubmitSelect(option: string, appId: number) {
    let status = (option == "option1") ? 1 : (option == "option2") ? -1 : 0;
    // console.log("status: " + status + " stId: " + (appId));
    this.managerService.updateApplicationStatus(status, appId);
  }

  checkStudentHasComment(studentSSOUid: number): boolean {
    const studentComment = this.hasMadeComment.find((comment: { studentId: number; hasComment: boolean }) => comment.studentId === studentSSOUid);
    return (studentComment && studentComment.hasComment);
  }

}
