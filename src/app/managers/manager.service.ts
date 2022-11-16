import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Manager } from "./manager.model";

const MANAGER_URL = "http://localhost:3000/api/managers/";

@Injectable({ providedIn: 'root' })
export class ManagerService {
  public manager: Manager[] = [];

  constructor(private http: HttpClient, public authService: AuthService) { }

  getManager(): Observable<Array<Manager>> {
    let id = this.authService.getSessionId();
    const fetchedManager = this.http.get<Array<Manager>>(MANAGER_URL + 'getmanager/' + id);
    return fetchedManager;
  }

  insertCommentsByStudentId(studentId: number, comments: string) {
    const commentsJson: any = { 'comments': comments };
    this.http
      .post<{ message: string }>(MANAGER_URL + "insertCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateCommentsByStudentId(studentId: number, comments: string) {
    const commentsJson: any = { 'comments': comments};
    this.http
      .put<{ message: string }>(MANAGER_URL + "updateCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  getCommentByStudentIdAndSubject(studentId: number, subject: string): Observable<any> {
     const params = new HttpParams()
      .set('studentId', studentId)
      .set('subject', subject);
    const fetchedComment = this.http.get<any>(MANAGER_URL + "getCommentByStudentIdAndSubject/", { params });
    return fetchedComment;
  }

}
