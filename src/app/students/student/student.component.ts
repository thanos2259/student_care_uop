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
  areOptionsEnabled!: boolean;

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
          });
      });
  }

  ngOnDestroy(): void {
    this.studentSubscription?.unsubscribe();
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
}
