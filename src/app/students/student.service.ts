import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Application } from "./application.model";
import { StudentApplication } from "./student-application.model";
import { environment } from "src/environments/environment";
import { Question } from "./question.model";

const STUDENTS_URL = environment.apiUrl + "/students/";
const MANAGER_URL = environment.apiUrl + "/managers/";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!: Observable<Array<Student>>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>(STUDENTS_URL + 'getStudentById/' + id);
    return fetchedStudents;
  }

  getAllStudents(): Observable<Array<Student>> {
    const fetchedStudents = this.http.get<Array<Student>>(STUDENTS_URL);
    return fetchedStudents;
  }

  checkUserAcceptance(): Observable<{message: string, accepted: boolean}> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<{ message: string; accepted: boolean }>(STUDENTS_URL + "checkUserAcceptance/" + studentId);
  }

  getStudentsAppsMealsForPeriod(): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<StudentApplication>>(STUDENTS_URL + 'getStudentsApplyPhaseMeals/' + id);
    return fetchedStudents;
  }

  getStudentsAppsMealsForYear(year: number): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const params = new HttpParams()
      .set('id', id)
      .set('year', year);
    const fetchedStudentApps = this.http.get<Array<StudentApplication>>(STUDENTS_URL  + 'getStudentsApplyPhaseMealsByYear', { params });
    return fetchedStudentApps;
  }

  getStudentsAppsAccommodationForPeriod(): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<StudentApplication>>(STUDENTS_URL + 'getStudentsApplyPhaseAccommodation/' + id);
    return fetchedStudents;
  }

  getStudentsAppsAccommodationForYear(year: number): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const params = new HttpParams()
      .set('id', id)
      .set('year', year);
    const fetchedStudentApps = this.http.get<Array<StudentApplication>>(STUDENTS_URL  + 'getStudentsApplyPhaseAccommodationByYear', { params });
    return fetchedStudentApps;
  }

  getOldStudentsAppsForMeals(): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<StudentApplication>>(STUDENTS_URL + 'getOldStudentsAppsForMeals/' + id);
    return fetchedStudents;
  }

  getOldStudentsAppsForAccommodation(): Observable<Array<StudentApplication>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<StudentApplication>>(STUDENTS_URL + 'getOldStudentsAppsForAccommodation/' + id);
    return fetchedStudents;
  }

  sendFileByType(studentId: number, fileName: string, appType: 'mea' | 'acc'): Observable<Blob> {
    const url = STUDENTS_URL + "sendFileByType/" + studentId;
    return this.http.post(url, { 'fileName': fileName, "appType": appType }, { responseType: 'blob' });
  }

  receiveZipFileMeals(studentId: number, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "getMealsAppZipFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
  }

  receiveZipFileAccommodation(studentId: number, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "getAccommodationAppZipFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
  }

  getApplication(): Observable<Array<Application>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Application>>(STUDENTS_URL + 'getStudentApplicationById/' + id);
    return fetchedStudents;
  }

  getAccommodationFiles(applicationId): Observable<Array<any>> {
    const fetchedFiles = this.http.get<Array<any>>(STUDENTS_URL + 'getAccommodationFiles/' + applicationId);
    return fetchedFiles;
  }

  getCommentByStudentIdAndSubject(studentId: number, subject: string): Observable<any> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('subject', subject);
    const fetchedComment = this.http.get<any>(STUDENTS_URL + "getCommentByStudentIdAndSubject/", { params });
    return fetchedComment;
  }

  getAllPeriodDates(departmentId: number): Observable<any> {
    return this.http.get<any>(MANAGER_URL + 'getPeriodInfo/' + departmentId);
  }

  getStudentsMealsCountByYearAndDepartment(year: any): Observable<any> {
    return this.http.get<any>(STUDENTS_URL + 'getStudentsMealsCountByYearAndDepartment/' + year);
  }

  updateStudentDetails(data: any) {
    const id = this.authService.getSessionId();
    // const student: string = modelStudent;
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentBasicInfo(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentBasicInfo/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentBasicDocuments(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentBasicDocuments/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentSpecialData(data: any, submittedFilesData: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentSpecialData/" + id,
        { studentData: data, submittedFilesData: submittedFilesData })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContact(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  uploadFile(file: any, fileUniqueIndex: string): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "upload/" + id + "/" + fileUniqueIndex, file);
  }

  updateSpecialField(appId: number, value: string | number, field: string): any {
    return this.http
      .patch<{ message: string }>(STUDENTS_URL + "applications/updateSpecialField/" + appId,
         { "fieldValue": value, "fieldName": field });
  }

  updateOptionalFilesStatus(appId: number, filenames: string[], value: boolean): any {
    const requestBody = {
      filenames: filenames,
      value: value
    };
    return this.http
      .patch<{ message: string }>(STUDENTS_URL + "applications/updateOptionalFilesStatus/" + appId, requestBody);
  }

  submitQuestion(question: any): Observable<any> {
    question.student_id = this.authService.getSessionId();
    return this.http.post<any>(STUDENTS_URL + "/questions/", question);
  }

  getQuestionsByStudentId(): Observable<Question[]> {
    const studentId: number = this.authService.getSessionId();
    return this.http.get<Question[]>(STUDENTS_URL + "/questions/" + studentId);
  }

  insertStudentTermsAcceptance(areTermsAccepted: boolean): Observable<any> {
    const studentId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "/insertUserAcceptance/" + studentId, { areTermsAccepted });
  }

}
