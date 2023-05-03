import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { StudentsService } from '../student.service';
import { Question } from '../question.model';
import { Student } from '../student.model';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-student-questions',
  templateUrl: './student-questions.component.html',
  styleUrls: ['./student-questions.component.css']
})
export class StudentQuestionsComponent implements OnInit, AfterViewInit {
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

  constructor(private studentsService: StudentsService, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
      });
    this.fetchQuestions();
  }

  get isDarkModeEnabled(): boolean {
    return localStorage.getItem("mode") === "dark";
  }

  updateTableDarkMode() {
    const tables = this.el.nativeElement.querySelectorAll('.table');
    tables.forEach((table: HTMLElement) => {
      if (this.isDarkModeEnabled) {
        this.renderer.addClass(table, 'table-dark');
      } else {
        this.renderer.removeClass(table, 'table-dark');
      }
    });
  }

  observeBodyClassChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          this.updateTableDarkMode();
        }
      });
    });

    observer.observe(document.body, { attributes: true });
  }

  ngAfterViewInit() {
    this.observeBodyClassChanges();
    this.updateTableDarkMode();
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
          this.previousQuestions = questions.map(question => {
            question.date_submitted = Utils.getPreferredTimestamp(question.date_submitted);
            return question;
          });
        },
        (error) => {
          console.error('Error fetching questions:', error);
          Swal.fire(
            { title: 'Σφάλμα στη φόρτωση ερωτήσεων', text: 'Υπήρξε σφάλμα κατά τη φόρτωση των προηγούμενων ερωτήσεων', icon: 'error' }
          );
        }
      );
  }
}
