import { Component, OnInit } from '@angular/core';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import Swal from 'sweetalert2';
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
        this.studentsSSOData[0].schacdateofbirth = this.reformatDateOfBirth(this.studentsSSOData[0].schacdateofbirth);
      });
  }

  location = Utils.location;
  countries = Utils.countries;

  private reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;
    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);
    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  onSubmitStudentDetails(data: any) {
    console.log(data);
    this.studentsService.updateStudentDetails(data);
    this.onSave();
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
    this.onSave();
  }

  onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      // Reload the Page
      // To be changed in the future refresh strategy is not good
      location.reload();
    });
  }

}
