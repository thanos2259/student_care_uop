import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private sessionId = 0;
  private shown: boolean = false;
  private authStatusListener = new Subject<Boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getShown() {
    return this.shown;
  }

  setShown(value: boolean) {
    this.shown = value;
  }

  getSessionId(): number {
    if (!this.sessionId) {
      let userId: any = localStorage.getItem("sessionId");
      let userIdNumber = Number.parseInt(userId);
      this.sessionId = userIdNumber;
    }

    return this.sessionId;
  }

  getIsAuthenticated(): Boolean {
    return this.isAuthenticated;
  }

  public setToken(tokenParam: string | undefined) {
    if (!this.token)
      this.token = tokenParam;
  }

  public setSessionId(sessionIdParam: number) {
    if (!this.sessionId)
      this.sessionId = sessionIdParam;
  }

  login(username: string) {
    // const id = 1;
    // this.http.post<{ token: string, userId: number }>('http://localhost:3000/api/students/login/' + id, username)
    return this.http.post<{ token: string; userId: number; }>('http://localhost:3000/api/students/login', { "username": username });
  }


  private clearAuthData() {
    localStorage.removeItem("token");
    //localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.removeItem("sessionId");
  }

  logout() {
    // clear token
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(["/"]);
  }
}
