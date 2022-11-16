import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentsService } from 'src/app/students/student.service';
import { Manager } from '../manager.model';

@Component({
  selector: 'app-manager-meals',
  templateUrl: './manager-meals.component.html',
  styleUrls: ['./manager-meals.component.css']
})

export class ManagerMealsComponent implements OnInit {

  @ViewChild('processing') table1: ElementRef | undefined;
  @ViewChild('completed') table2: ElementRef | undefined;

  studentsSSOData: Manager[] = [];

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Manager[]) => {
        this.studentsSSOData = students;
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

}