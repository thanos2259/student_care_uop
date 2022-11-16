import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Application } from "./application.model";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!: Observable<Array<Student>>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students/getStudentById/' + id);
    return fetchedStudents;
  }

  getAllStudents(): Observable<Array<Student>> {
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students/');
    return fetchedStudents;
  }

  getApplication(): Observable<Array<Application>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Application>>('http://localhost:3000/api/students/getStudentApplicationById/' + id);
    return fetchedStudents;
  }

  getAccommodationFiles(applicationId): Observable<Array<any>> {
    const fetchedFiles = this.http.get<Array<any>>('http://localhost:3000/api/students/getAccommodationFiles/' + applicationId);
    return fetchedFiles;
  }

  updateStudentDetails(data: any) {
    const id = this.authService.getSessionId();
    // const student: string = modelStudent;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentBasicInfo(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentBasicInfo/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentBasicDocuments(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentBasicDocuments/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentSpecialData(data: any, submittedFilesData: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentSpecialData/" + id,
        { studentData: data, submittedFilesData: submittedFilesData })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContact(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  uploadFile(file: any, fileUniqueIndex: string): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/upload/" + id + "/" + fileUniqueIndex, file);
  }
}
