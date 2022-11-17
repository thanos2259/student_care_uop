import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  selected: Date | null | undefined;
  comment: any;
  studentsSSOData: Student[];

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsService.getCommentByStudentIdAndSubject(this.studentsSSOData[0]?.sso_uid, 'Σίτιση')
          .subscribe((comment: any) => {
            this.comment = comment;
          });
      });
  }

}
