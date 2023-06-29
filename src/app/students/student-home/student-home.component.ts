import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { Utils } from 'src/app/MiscUtils';
import { Period } from 'src/app/managers/period.model';
import Swal from 'sweetalert2';
import { StudyLevels } from '../study-levels';

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
         const deptId = Number(this.studentsSSOData[0]?.department_id);
         this.studentsService.getAllPeriodDates(deptId)
          .subscribe((period: any) => {
            for (let item of period) {
              if (item.app_type == 'meals') {
                this.periodMeals = item;
                this.periodMeals.date_from = Utils.reformatDateToEULocaleStr(item.date_from);
                this.periodMeals.date_to = Utils.reformatDateToEULocaleStr(item.date_to);

                let isStudentActive: boolean = true;
                const studyLevel = Number(this.studentsSSOData[0].Studieslevel);

                if (studyLevel == StudyLevels.PROPTUXIAKO) {
                  const deptMonthsOfStudy = Utils.getYearsOfStudy(deptId) * 2;
                  isStudentActive = this.studentsSSOData[0].Semester < (deptMonthsOfStudy + 4);
                  if (!isStudentActive) {
                    Swal.fire({
                      position: 'top',
                      text: "Δεν μπορείτε να κάνετε αίτηση για Σίτιση καθώς έχετε υπερβεί το επιτρεπτό έτος φοίτησης",
                      showConfirmButton: true,
                      confirmButtonColor: '#224957',
                      color: '#000'
                    });
                  }
                }
              } else {
                this.periodAccommodation = item;
                this.periodAccommodation.date_from = Utils.reformatDateToEULocaleStr(item.date_from);
                this.periodAccommodation.date_to = Utils.reformatDateToEULocaleStr(item.date_to);
              }
            }

            // alert(this.studentsSSOData[0].Studieslevel);
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
