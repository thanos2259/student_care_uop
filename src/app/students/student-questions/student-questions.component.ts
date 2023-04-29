import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-questions',
  templateUrl: './student-questions.component.html',
  styleUrls: ['./student-questions.component.css']
})
export class StudentQuestionsComponent implements OnInit {
  panelOpenState = false;

  constructor() { }

  ngOnInit(): void { }

  insertNewQuestion() {
    alert("ΔΕΝ ΕΧΕΙ ΥΛΟΠΟΙΗΘΕΙ ΑΚΟΜΑ");
  }
}
