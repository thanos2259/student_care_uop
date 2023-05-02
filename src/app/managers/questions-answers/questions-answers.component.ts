import { Component, OnInit } from '@angular/core';

import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/MiscUtils';
import { Student } from 'src/app/students/student.model';
import { Question } from 'src/app/students/question.model';
import { ManagerService } from '../manager.service';
import { QuestionAnswerDialogComponent } from '../question-answer-dialog/question-answer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StudentViewMinimalInfoDialogComponent } from '../student-view-minimal-info-dialog/student-view-minimal-info-dialog.component';

@Component({
  selector: 'app-questions-answers',
  templateUrl: './questions-answers.component.html',
  styleUrls: ['./questions-answers.component.css']
})
export class QuestionsAnswersComponent implements OnInit {
  public previousQuestions: any[] = [];
  public question: Question = {
    department_id: 0,
    receiver_role: 'manager',
    student_id: 0,
    question_text: '',
  };
  public dateOfTicket: string[] = [];

  constructor(private managerService: ManagerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchQuestions();
  }

  insertNewQuestion() {
    this.question.department_id = Number(this.question.department_id);
    this.managerService
    .submitAnswer(this.question)
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

  openUpdateAnswerDialog(questionId: number, notes: string) {
    console.log(questionId);
    const dialogRef = this.dialog.open(QuestionAnswerDialogComponent, {
      data: { notes: notes, questionId: questionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      // Re-fetch the student data to update notes etc.
      this.fetchQuestions();
    });
  }

  fetchQuestions() {
    this.managerService.getQuestions()
      .subscribe(
        (questions: any) => {
          this.previousQuestions = questions.map(question => {
            question.date_submitted = Utils.getPreferredTimestamp(question.date_submitted);
            return question;
          });
        },
        (error) => {
          console.error('Error fetching questions:', error);
          Swal.fire(
            {title: 'Σφάλμα στη φόρτωση ερωτήσεων', text: 'Υπήρξε σφάλμα κατά τη φόρτωση των προηγούμενων ερωτήσεων', icon: 'error'}
          );
        }
      );
  }

  getDepartmentNameById(depId: number) {
    return Utils.departmentsMap[depId];
  }

  studentInfo(idx: number) {
    console.log(idx);
    const studentsSSOData = { 'givenname': this.previousQuestions[idx].displayname,
                              'am': this.previousQuestions[idx].schacpersonaluniquecode,
                              'mail': this.previousQuestions[idx].mail,
                              'dob': this.previousQuestions[idx].schacdateofbirth };
    const dialogRef = this.dialog.open(StudentViewMinimalInfoDialogComponent, {
      data: { studentsData: studentsSSOData },
      width: '410px',
      height: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
