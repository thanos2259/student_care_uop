import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { StudentsService } from 'src/app/students/student.service';
import { Student as Manager } from 'src/app/students/student.model';
import { ManagerService } from '../manager.service';
import { environment } from 'src/environments/environment';

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

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute, public authService: AuthService, public translate: TranslateService, public managerService: ManagerService) {
    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';
    if (!environment.production) {
      this.authService.setSessionId(2);
    }

    if (this.router.url.includes('/manager/login')) {
      this.route.queryParams
        .subscribe(params => {
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
          this.router.navigateByUrl('/manager/' + this.authService.getSessionId());
          this.fetchManager();
        }
      );
    }
    this.fetchManager();
  }

  public fetchManager() {
    this.managerService.getManager()
      .subscribe((managers: Manager[]) => {
        this.managerSSOData = managers;
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

  isManagerQNARoute() {
    return this.router.url === '/manager/qna'
  }

  isManagerQuestionsRoute() {
    return this.router.url === '/manager/questions/' + this.authService.getSessionId();
  }

  isManagerStatsRoute() {
    return this.router.url === '/manager/stats/' + this.authService.getSessionId();
  }
}
