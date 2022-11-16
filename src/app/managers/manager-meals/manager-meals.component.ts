import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from 'src/app/students/student.service';
import { Student } from '../../students/student.model';
import {CommentsDialogComponent} from '../comments-dialog/comments-dialog.component';

@Component({
  selector: 'app-manager-meals',
  templateUrl: './manager-meals.component.html',
  styleUrls: ['./manager-meals.component.css']
})

export class ManagerMealsComponent implements OnInit {

  @ViewChild('processing') table1: ElementRef | undefined;
  @ViewChild('completed') table2: ElementRef | undefined;

  studentsSSOData: Student[] = [];

  constructor(public studentsService: StudentsService, public authService: AuthService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.studentsService.getAllStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        for (let i = 0; i < students.length; i++) {
          this.studentsSSOData[i].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[i].schacpersonaluniquecode);
        }
      });

    const table: any = $('#processing');
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
      columnDefs: [{ orderable: false, targets: [6, 7] }],
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

  }

  exportToExcel() {

  }

  printDataTable() {

  }

  openCommentsDialog(idx: any) {
    console.log(idx);
    const dialogRef = this.dialog.open(CommentsDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: idx }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
