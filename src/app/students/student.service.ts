import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!: Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();
  constructor(private http: HttpClient, public authService: AuthService) { }

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students/getStudentById/' + id);
    this.fetchedStudentsObservable = fetchedStudents;
    this.fetchedStudentsObservable.subscribe((students: Student[]) => {
      this.students = [...students];
    });
    return fetchedStudents;

    // .subscribe(postData => {
    //   this.students = postData;
    //   console.log(postData);
    //   this.studentsUpdated.next([...this.students]);
    // });
  }






  // get active application
  getStudentActiveApplication(): Observable<number> {
    const studentId = this.authService.getSessionId();
    console.log("of user: " + this.authService.getSessionId());
    return this.http
      .get<number>('http://localhost:3000/api/students/getStudentActiveApplication/' + studentId);
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

  updateStudentContractDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractSSNFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentSSNFile/" + id, file);
    // .subscribe(responseData => {
    // console.log("ssn " + responseData.message);
    // return responseData.message;
    // });
  }

  updateStudentContractIbanFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentIbanFile/" + id, file);
    // .subscribe(responseData => {
    //   console.log(responseData.message);
    //   return responseData.message;
    // });
  }

  updateStudentBio(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentBio/" + id, data)
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

  updateStudentEntrySheet(data: any) {
    const studentId = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentEntrySheet/" + studentId, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentPosition(positionId: number, atlas: boolean) {
    const studentId = this.authService.getSessionId();
    if (atlas)
      return this.http
        .post<{ message: string }>("http://localhost:3000/api/students/insertStudentPosition/" + studentId, { positionId });
    else
      return this.http
        .post<{ message: string }>("http://localhost:3000/api/students/insertStudentPosition/" + studentId, { 'internal_position_id': positionId });
  }

  // Not currently used
  // deleteStudentPosition(positionPriority: number) {
  //   this.http
  //     .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionByStudentId/" + positionPriority)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //     });
  // }

  deleteStudentPositions(studentId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionsByStudentId/" + studentId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deleteApplicationById(applicationId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/students/deleteApplicationById/" + applicationId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositionPriorities(positionPriority: number) {
    let id = this.authService.getSessionId();
    const form: any = { 'priority': positionPriority, 'student_id': id };
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentPositionPriorities/" + positionPriority, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePhase(phase: number) {
    const studentId = this.authService.getSessionId();
    const phaseJson: any = { 'phase': phase };
    console.log("phase " + phaseJson);
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updatePhase/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

}
