import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import {Utils} from 'src/app/MiscUtils';
import {Period} from 'src/app/managers/period.model';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  selected: Date | null | undefined;
  commentSitisi: any;
  commentStegasi: any;
  studentsSSOData: Student[];
  public periodAccommodation: Period;
  public periodMeals: Period;

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
         this.studentsService.getAllPeriodDates(Number(this.studentsSSOData[0]?.department_id))
          .subscribe((period: any) => {
            for (let item of period) {
              if (item.app_type == 'meals') {
                this.periodMeals = item;
                this.periodMeals.date_from = Utils.reformatDateToEULocaleStr(item.date_from);
                this.periodMeals.date_to = Utils.reformatDateToEULocaleStr(item.date_to);
              } else {
                this.periodAccommodation = item;
                this.periodAccommodation.date_from = Utils.reformatDateToEULocaleStr(item.date_from);
                this.periodAccommodation.date_to = Utils.reformatDateToEULocaleStr(item.date_to);
              }
            }
          });
        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Σίτιση')
          .subscribe((comment: any) => {
            this.commentSitisi = comment;
          });
        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Στέγαση')
          .subscribe((comment: any) => {
            this.commentStegasi = comment;
          });
      });
  }

}
