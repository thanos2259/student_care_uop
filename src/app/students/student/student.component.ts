import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment/moment';
import { StudentCommentsDialogComponent } from '../student-comments-dialog/student-comments-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import {Utils} from 'src/app/MiscUtils';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit, OnDestroy {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  public isAccommodationEnabled: boolean = false;
  public isMealsEnabled: boolean = false;
  public studentsSSOData: Student[] = [];
  fontSize: number = 100;
  private language!: string;
  dateFrom!: string;
  dateTo!: string;
  public commentSitisi!: any;
  public commentStegasi!: any;

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute, public authService: AuthService,
    public translate: TranslateService, public dialog: MatDialog) {

    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';
    if (!environment.production) {
      this.authService.setSessionId(1);
    }
    if (this.router.url.includes('/student/login')) {
      this.route.queryParams
        .subscribe(params => {
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
          this.router.navigateByUrl('/student/' + this.authService.getSessionId());
        }
      );
    }
    this.fetchStudent();
  }

  public fetchStudent() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsService.getAllPeriodDates(Number(this.studentsSSOData[0]?.department_id))
          .subscribe((period: any) => {
            for (let item of period) {
              console.log(item);
              if (item.app_type == 'meals') {
                this.dateFrom = Utils.reformatDateToEULocaleStr(item.date_from);
                this.dateTo = Utils.reformatDateToEULocaleStr(item.date_to);

                const isPeriodDateActive = moment(new Date()).isSameOrBefore(item.date_to, 'day') && moment(new Date()).isSameOrAfter(period.date_from, 'day');
                this.isMealsEnabled = isPeriodDateActive;
              } else {
                this.dateFrom = Utils.reformatDateToEULocaleStr(item.date_from);
                this.dateTo = Utils.reformatDateToEULocaleStr(item.date_to);

                const isPeriodDateActive = moment(new Date()).isSameOrBefore(item.date_to, 'day') && moment(new Date()).isSameOrAfter(item.date_from, 'day');
                this.isAccommodationEnabled = isPeriodDateActive;
              }
            }
          });
        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Σίτιση')
          .subscribe((comment: any) => {
            this.commentSitisi = comment;
            const dateDif = moment(comment.comment_date, "YYYY-MM-DD HH:mm:ss").locale("el").fromNow();
            this.commentSitisi.comment_date = dateDif;
          });
        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Στέγαση')
          .subscribe((comment: any) => {
            this.commentStegasi = comment;
            const dateDif = moment(comment.comment_date, "YYYY-MM-DD HH:mm:ss").locale("el").fromNow();
            this.commentStegasi.comment_date = dateDif;
          });
      });
  }

  ngOnDestroy(): void {

  }

  onLogout() {
    this.authService.logout();
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize += 10 : this.fontSize -= 10; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    if (this.fontSize >= 200) this.fontSize = 200;
    else if (this.fontSize <= 70) this.fontSize = 70;

    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  resetFont() {
    this.fontSize = 100; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  changeLang(language: string) {
    localStorage.setItem('language', language);
    // window.location.reload();
    this.translate.use(language);
  }

  openCommentsDialog(subject: string) {
    const dialogRef = this.dialog.open(StudentCommentsDialogComponent, {
      data: { studentsData: this.studentsSSOData, index: 0, subject: subject }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onDarkModeSwitched() { }

  isProfileRoute() {
    return this.router.url === '/student/profile/' + this.authService.getSessionId();
  }

  isStudentRoute() {
    return this.router.url === '/student/' + this.authService.getSessionId();
  }

  isAboutRoute() {
    return this.router.url === '/student/about';
  }

  isManualsRoute() {
    return this.router.url === '/student/manuals';
  }

  isContactRoute() {
    return this.router.url === '/student/contact'
  }

  isAccommodationRoute() {
    return this.router.url === '/student/accommodation/' + this.authService.getSessionId();
  }

  isMealsRoute() {
    return this.router.url === '/student/meals/' + this.authService.getSessionId();
  }

  isApplicationssRoute() {
    return this.router.url === '/student/applications/' + this.authService.getSessionId();
  }

   isStudentQuestions() {
    return this.router.url === '/student/questions/' + this.authService.getSessionId();
  }

  isQNARoute() {
    return this.router.url === '/student/qna';
  }
}
