import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentsService } from 'src/app/students/student.service';
import { Student as Manager } from 'src/app/students/student.model';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit, OnDestroy {
  @Output()
  readonly darkModeSwitched = new EventEmitter<boolean>();

  public managerSSOData: Manager[] = [];
  fontSize: number = 100;
  private language!: string;
  dateFrom!: string;
  dateTo!: string;

  constructor(public studentsService: StudentsService, private router: Router, public authService: AuthService, public translate: TranslateService, public managerService: ManagerService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    this.fetchManager();
  }

  public fetchManager() {
    this.authService.loginManager('pcst19009')
      .subscribe((response) => {
        this.authService.setToken(response.token);
        this.authService.setSessionId(response.userId);
        console.log(response);
        this.managerService.getManager()
          .subscribe((managers: Manager[]) => {
            this.managerSSOData = managers;
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

  isAboutRoute() {
    return this.router.url === '/manager/about';
  }

  isManualsRoute() {
    return this.router.url === '/manager/manuals';
  }

  isContactRoute() {
    return this.router.url === '/manager/contact'
  }

}
