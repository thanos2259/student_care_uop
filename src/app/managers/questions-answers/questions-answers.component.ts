import { Component, OnInit } from '@angular/core';

import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { Question } from 'src/app/students/question.model';
import { ManagerService } from '../manager.service';

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.css']
})
export class QuestionsAnswersComponent implements OnInit {
 public panelOpenState = false;
  public studentsSSOData: Student[];
  public previousQuestions: Question[] = [];
  public question: Question = {
    department_id: 0,
    receiver_role: 'manager',
    student_id: 0,
    question_text: '',
  };
  public dateOfTicket: string[] = [];

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
    // this.studentsService.getStudents()
    //   .subscribe((students: Student[]) => {
    //     this.studentsSSOData = students;
    //   });
    // this.fetchQuestions();
  }

  // insertNewQuestion() {
  //   this.question.department_id = Number(this.studentsSSOData[0].department_id);
  //   this.managerService
  //   .submitAnswer(this.question)
  //   .pipe(
  //     catchError((error) => {
  //       console.error('Error submitting question:', error);
  //       alert('Error submitting question');
  //       return throwError(() => error);
  //     })
  //   )
  //   .subscribe(
  //     (response) => {
  //       console.log('Question submitted successfully:', response);
  //       Swal.fire({
  //         title: 'Υποβολή Ερώτησης', text: 'Η ερώτηση υποβλήθηκε με επιτυχία', icon: 'success'
  //       }).then((result) => {
  //         if (!result.isConfirmed) {
  //           console.log("User pressed Cancel or closed the popup");
  //         } else {
  //           location.reload();
  //         }
  //       });
  //     }
  //   );
  // }

  // fetchQuestions() {
  //   this.managerService.getQuestions()
  //     .subscribe(
  //       (questions: any) => {
  //         this.previousQuestions = questions.map(question => {
  //           question.date_submitted = Utils.getPreferredTimestamp(question.date_submitted);
  //           return question;
  //         });
  //       },
  //       (error) => {
  //         console.error('Error fetching questions:', error);
  //         Swal.fire(
  //           {title: 'Σφάλμα στη φόρτωση ερωτήσεων', text: 'Υπήρξε σφάλμα κατά τη φόρτωση των προηγούμενων ερωτήσεων', icon: 'error'}
  //         );
  //       }
  //     );
  // }
}
