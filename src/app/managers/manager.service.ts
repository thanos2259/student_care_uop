import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Manager } from "./manager.model";
import { environment } from "src/environments/environment";

const MANAGER_URL = environment.apiUrl + "/managers/";

@Injectable({ providedIn: 'root' })
export class ManagerService {
  public manager: Manager[] = [];

  constructor(private http: HttpClient, public authService: AuthService) { }

  getManager(): Observable<Array<Manager>> {
    let id = this.authService.getSessionId();
    const fetchedManager = this.http.get<Array<Manager>>(MANAGER_URL + 'getManager/' + id);
    return fetchedManager;
  }

  getManagerCities(): Observable<any> {
    let id = this.authService.getSessionId();
    const citiesManagedByUser = this.http.get<any>(MANAGER_URL + 'getManagerCities/' + id);
    return citiesManagedByUser;
  }

  getAcademicYearsOrdered(type: string): Observable<any> {
    let id = this.authService.getSessionId();
    const params = new HttpParams()
      .set('id', id)
      .set('type', type);
    return this.http.get<Array<number>>(MANAGER_URL + 'getAcademicYearsOrdered/', {params});
  }

  insertCommentsByStudentId(studentId: number, comments: string, subject: string) {
    const commentsJson: any = { 'comments': comments, 'subject': subject };
    this.http
      .post<{ message: string }>(MANAGER_URL + "insertCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }

  insertPeriodDates(data: any, depId: number) {
    let managerId = this.authService.getSessionId();
    const params = new HttpParams()
      .set('managerId', managerId)
      .set('depId', depId);
    return this.http
      .post<{ message: string }>(MANAGER_URL + "insertPeriodDates/", data, { params })
  }

  updateCommentsByStudentId(studentId: number, comments: string, subject: string) {
    const commentsJson: any = { 'comments': comments, 'subject': subject };
    this.http
      .put<{ message: string }>(MANAGER_URL + "updateCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateAnswerByQuestionId(answerText: string, questionId: number) {
    this.http
      .put<any>(MANAGER_URL + "questions/" + questionId, { answerText })
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

  getPeriodInfo(deptId: number): Observable<any> {
    return this.http.get<any>(MANAGER_URL + "getPeriodInfo/" + deptId);
  }

  updateApplicationStatus(status: any, appId: number) {
    this.http
      .put<any>(MANAGER_URL + "updateApplicationStatus/" + appId, { status })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateNotesByAppId(notes: string, appId: number) {
    this.http
      .put<any>(MANAGER_URL + "updateNotesByAppId/" + appId, { notes })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  submitAnswer(question: any): Observable<any> {
    question.student_id = this.authService.getSessionId();
    return this.http.post<any>(MANAGER_URL + "/questions/", question);
  }

  getQuestions(): Observable<any> {
    return this.http.get<any>(MANAGER_URL + "/questions/");
  }

}
