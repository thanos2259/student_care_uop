import { Component, OnInit } from '@angular/core';
import {Application} from '../application.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})

export class ApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['application', 'applicationNumber', 'date', 'status', 'actions'];
  studentApplications!: Application[];
  dataSource!: any;

  constructor(public studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.getApplication()
      .subscribe((applications: Application[]) => {
        this.studentApplications = applications;
        this.dataSource = this.studentApplications;
      })
  }
}


