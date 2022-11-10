import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/students/student.model';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-manuals',
  templateUrl: './manuals.component.html',
  styleUrls: ['./manuals.component.css']
})
export class ManualsComponent implements OnInit {

  constructor(public studentsService: StudentsService) { }

  studentsSSOData: Student[] = [];

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
      });
  }
}
