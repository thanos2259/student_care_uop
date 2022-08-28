import { Component, OnInit } from '@angular/core';
// import {flatMap, interval, mergeMap, takeWhile} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Utils } from '../../MiscUtils'

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {
  studentsSSOData!: Student[];
  dateFrom!: string;
  dateTo!: string;

  phaseArray = ["no-state", "STUDENT.PHASE-1", "STUDENT.PHASE-2", "STUDENT.PHASE-3"];

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {

  }
}
