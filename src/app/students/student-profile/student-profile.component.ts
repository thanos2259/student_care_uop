import { Component, OnInit } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})

export class StudentProfileComponent implements OnInit {

  studentsSSOData: Student[] = [];

  constructor(public studentsService: StudentsService) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacdateofbirth = Utils.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
      });
  }

  location = Utils.location;
  countries = Utils.countries;

  onSubmitStudentDetails(data: any) {
    this.studentsService.updateStudentDetails(data);
    Utils.onSaveAndReload();
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
    Utils.onSaveAndReload();
  }

}
