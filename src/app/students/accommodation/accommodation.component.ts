import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/MiscUtils';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})

export class accommodationComponent implements OnInit {
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  contactFormGroup!: FormGroup;
  specialDataFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder) { }

  ngOnInit() {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[0].schacpersonaluniquecode);
        this.studentsSSOData[0].department_id = this.departmentsMap[this.studentsSSOData[0].department_id];

        this.firstFormGroup = this._formBuilder.group({
          name: [],
          surname: [],
          fatherName: ['', Validators.required],
          registrationNumber: [],
          depName: [],
          municipality: [this.location[this.getIndexOfLocation()], Validators.required],
          city: ['', Validators.required],
          phone: ['', Validators.required],
          mail: [],
        });
      });

    this.secondFormGroup = this._formBuilder.group({
      ssnControl: ['', Validators.required],
      doyControl: ['', Validators.required],
      amkaControl: ['', Validators.required],
      ibanControl: ['', Validators.required],
      ssnFile: ['', Validators.required],
      ibanFile: ['', Validators.required]
    });

    this.contactFormGroup = this._formBuilder.group({
      emailCtrl: ['', Validators.required],
      phoneCtrl: [],
      addressCtrl: [],
      locationCtrl: [],
      cityCtrl: [],
      postalCodeCtrl: []
    });

    this.specialDataFormGroup = this._formBuilder.group({
      ameaCatCtrl: ['', Validators.required],
      workingCatCtrl: ['', Validators.required],
      armyCatCtrl: ['', Validators.required]
    });
  }

  getIndexOfLocation() {
    let index = -1;
    let val = this.studentsSSOData[0].location;
    this.location.find(function (item, i) {
      if (item.name === val) {
        index = i;
        return i;
      }
    });
    return index;
  }

  location = Utils.location;
  departmentsMap = Utils.departmentsMap;

  //checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
  //const fieldValue = givenFormGroup.get(field)?.value;
  //return fieldValue && fieldValue != null && fieldValue != '';
  //}

  /**
   * Used to update student details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    // check if the only required field in the last stepper is empty
    // to check if a more generic implementation can implemented
    //
    // if (!this.checkIfFieldEmpty(this.contactFormGroup, 'emailCtrl')) {
    //   return;
    // }
    const basicInfo: any = {
      father_name: this.firstFormGroup.get('fatherName')?.value,
      municipality: this.firstFormGroup.get('municipality')?.value,
      city: this.firstFormGroup.get('city')?.value,
      phone: this.firstFormGroup.get('phone')?.value
    };

    this.onSubmitStudentBasicInfo(basicInfo);
    Utils.onSaveApplication();
  }

  // uploadFile(fileValue: any): FormData {
  //   const imageBlob = fileValue?.files[0];
  //   const file = new FormData();
  //   file.set('file', imageBlob);
  //   return file;
  // }

  onSubmitStudentBasicInfo(data: any) {
    this.studentsService.updateStudentBasicInfo(data);
  }

  validateFiles(docType: string) {
    let ssnFile = this.secondFormGroup.get(docType)?.value;
    if (ssnFile == null) {
      return;
    }
    let fileName = ssnFile._fileNames;
    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'pdf':
        console.log('Allowed file format');
        break;
      default:
        Utils.onError();
        this.secondFormGroup.get(docType)?.setValue(null);
        break;
    }
  }

}

