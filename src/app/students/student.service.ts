import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!: Observable<Array<Student>>;

  constructor(private http: HttpClient, public authService: AuthService) { }


  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students/getStudentById/' + id);
    // this.fetchedStudentsObservable = fetchedStudents;
    // this.fetchedStudentsObservable.subscribe((students: Student[]) => {
    //   this.students = [...students];
    // });
    return fetchedStudents;

  }
  // this functions adds a new bio and details to a student
  updateStudentDetails(data: any) {
    const id = this.authService.getSessionId();
    // const student: string = modelStudent;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
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

  updateStudentContact(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentSpecialDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentSpecialDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  uploadTestFile(file: any, filename: string): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/upload/" + id + "&" + filename, file);
  }
}
