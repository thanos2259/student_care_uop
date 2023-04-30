import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../student.service';
import { Question } from '../question.model';
import { Student } from '../student.model';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-questions',
  templateUrl: './student-questions.component.html',
  styleUrls: ['./student-questions.component.css']
})
export class StudentQuestionsComponent implements OnInit {
  public panelOpenState = false;
  public studentsSSOData: Student[];
  public previousQuestions: Question[] = [];
  public question: Question = {
    department_id: 0,
    receiver_role: 'manager',
    student_id: 0,
    question_text: '',
  };

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
      });
    this.fetchQuestions();
  }

  insertNewQuestion() {
    this.question.department_id = Number(this.studentsSSOData[0].department_id);
    this.studentsService
    .submitQuestion(this.question)
    .pipe(
      catchError((error) => {
        console.error('Error submitting question:', error);
        alert('Error submitting question');
        return throwError(() => error);
      })
    )
    .subscribe(
      (response) => {
        console.log('Question submitted successfully:', response);
        Swal.fire({
          title: 'Υποβολή Ερώτησης', text: 'Η ερώτηση υποβλήθηκε με επιτυχία', icon: 'success'
        }).then((result) => {
          if (!result.isConfirmed) {
            console.log("User pressed Cancel or closed the popup");
          } else {
            location.reload();
          }
        });
      }
    );
  }

  fetchQuestions() {
    this.studentsService.getQuestionsByStudentId()
      .subscribe(
        (questions: any) => {
          this.previousQuestions = questions;
        },
        (error) => {
          console.error('Error fetching questions:', error);
          alert('Error fetching questions');
        }
      );
  }
}
