import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
})
export class StudentComponent implements OnInit, OnDestroy {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  public studentsSSOData: Student[] = [];
  private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;
  dateFrom!: string;
  dateTo!: string;
  isDeclarationEnabled!: boolean;
  areOptionsEnabled!: boolean;
  private INTEREST_EXPRESSION_PHASE: number = 1;
  private STUDENT_SELECTION_PHASE: number = 2;
  private PREFERENCE_DECLARATION_PHASE: number = 3;

  constructor(public studentsService: StudentsService, private router: Router, public authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  async ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    //  this.authService.login('pcst19009');
    this.fetchStudentAndPeriod();
  }

  // ngAfterViewInit(): void { }

  public fetchStudentAndPeriod() {
    this.authService.login('pcst19003')
      .subscribe((response) => {
        this.authService.setToken(response.token);
        this.authService.setSessionId(response.userId);
        console.log(response);
        this.studentsService.getStudents()
          .subscribe((students: Student[]) => {
            this.studentsSSOData = students;
            this.studentsSSOData[0].schacdateofbirth = Utils.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
            this.studentsSSOData[0].schacpersonaluniqueid = this.getSSN(this.studentsSSOData[0].schacpersonaluniqueid);
          });
      });
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
  }

  // This function is used to get the AMKA of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
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

  onDarkModeSwitched() { }

  isProfileRoute() {
    return this.router.url === '/student/profile/' + this.authService.getSessionId();
  }

  isStudentRoute() {
    return this.router.url === '/student/' + this.authService.getSessionId();
  }

  isInternshipRoute() {
    return this.router.url === '/student/myinternship/' + this.authService.getSessionId();
  }

  isPositionsRoute() {
    return this.router.url === '/student/positions/' + this.authService.getSessionId();
  }

  isAboutRoute() {
    return this.router.url === '/student/about';
  }

  isManualsRoute() {
    return this.router.url === '/student/manuals';
  }

  isCalendarRoute() {
    return this.router.url === '/student/calendar';
  }

  isSheetsRoute() {
    return this.router.url === '/student/sheets/' + this.authService.getSessionId();
  }

  isSheetInputRoute() {
    return this.router.url === '/student/sheets/input-sheet/' + this.authService.getSessionId();
  }

  isSheetOutputRoute() {
    return this.router.url === '/student/sheets/output-sheet/' + this.authService.getSessionId();
  }

  isSheetInputPreviewRoute() {
    return this.router.url === '/student/sheets/input-sheet-preview/' + this.authService.getSessionId();
  }

  isContactRoute() {
    return this.router.url === '/student/contact'
  }

  isStudentContractRoute() {
    return this.router.url === '/student/student-contract'
  }

  isEvaluationSheetRoute() {
    return this.router.url === '/student/sheets/evaluation-form/' + this.authService.getSessionId()
  }

  isPracticeEnableRoute() {
    return this.router.url === '/student/enable_intern/' + this.authService.getSessionId();
  }
}
