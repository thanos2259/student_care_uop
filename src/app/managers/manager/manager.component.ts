import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentsService } from 'src/app/students/student.service';
import { Student } from 'src/app/students/student.model';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit, OnDestroy {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  public studentsSSOData: Student[] = [];
  fontSize: number = 100;
  private language!: string;
  dateFrom!: string;
  dateTo!: string;

  constructor(public studentsService: StudentsService, private router: Router, public authService: AuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    //  this.authService.login('pcst19009');
    this.fetchStudent();
  }

  public fetchStudent() {
    this.authService.login('pcst19003')
      .subscribe((response) => {
        this.authService.setToken(response.token);
        this.authService.setSessionId(response.userId);
        console.log(response);
        this.studentsService.getStudents()
          .subscribe((students: Student[]) => {
            this.studentsSSOData = students;
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

  onDarkModeSwitched() { }

  isManagerRoute() {
    return this.router.url === '/manager/' + this.authService.getSessionId();
  }

  isManagerAccommodationRoute() {
    return this.router.url === '/manager/accommodation/' + this.authService.getSessionId();
  }

  isManagerMealsRoute() {
    return this.router.url === '/manager/meals/' + this.authService.getSessionId();
  }

  // isProfileRoute() {
  //   return this.router.url === '/student/profile/' + this.authService.getSessionId();
  // }

  // isAboutRoute() {
  //   return this.router.url === '/student/about';
  // }

  // isManualsRoute() {
  //   return this.router.url === '/student/manuals';
  // }

  // isContactRoute() {
  //   return this.router.url === '/student/contact'
  // }

  // isApplicationssRoute() {
  //   return this.router.url === '/student/applications/' + this.authService.getSessionId();
  // }
}
