import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import { Utils } from 'src/app/MiscUtils';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})

export class MealsComponent implements OnInit {
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

  getRegistrationNumber(str: string): string {
    let registrationNumber = [''];
    if (str.indexOf('/') == -1) {
      registrationNumber = str.split(":");
      return registrationNumber[8];
    } else {
      registrationNumber = str.split("/");
      return registrationNumber[1];
    }
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

  checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
    const fieldValue = givenFormGroup.get(field)?.value;
    return fieldValue && fieldValue != null && fieldValue != '';
  }

  location = Utils.location;
  departmentsMap = Utils.departmentsMap;

  /**
   * Used to update student general, contract and contact details,
   * as a controller function
   */
  updateStudentsAllDetails() {
    // check if the only required field in the last stepper is empty
    // to check if a more generic implementation can implemented
    if (!this.checkIfFieldEmpty(this.contactFormGroup, 'emailCtrl')) {
      return;
    }
    const generalDetailsData: any = {
      father_name: this.firstFormGroup.get('fatherName')?.value,
      municipality: this.firstFormGroup.get('municipality')?.value,
      city: this.firstFormGroup.get('city')?.value,
      phone: this.firstFormGroup.get('phone')?.value
    };
    const contractsData: any = {
      ssn: this.secondFormGroup.get('ssnControl')?.value,
      doy: this.secondFormGroup.get('doyControl')?.value,
      iban: this.secondFormGroup.get('ibanControl')?.value,
    };
    const contractFiles: any = {
      ssnFile: this.secondFormGroup.get('ssnFile')?.value,
      ibanFile: this.secondFormGroup.get('ibanFile')?.value
    };
    const contactDetails: any = {
      phone: this.contactFormGroup.get('phoneCtrl')?.value,
      address: this.contactFormGroup.get('addressCtrl')?.value,
      location: this.contactFormGroup.get('locationCtrl')?.value,
      city: this.contactFormGroup.get('cityCtrl')?.value,
      post_address: this.contactFormGroup.get('postalCodeCtrl')?.value,
      country: 'gr'
    };

    const specialDetails: any = {
      military_training: this.specialDataFormGroup.get('armyCatCtrl')?.value,
      working_state: this.specialDataFormGroup.get('workingCatCtrl')?.value,
      amea_cat: this.specialDataFormGroup.get('ameaCatCtrl')?.value
    }

    this.onSubmitStudentDetails(generalDetailsData);
    this.onSubmitStudentContractDetails(contractsData, contractFiles);
    this.onSubmitStudentContact(contactDetails);
    this.onSubmitStudentSpecialDetails(specialDetails);
    Utils.onSave();
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitStudentDetails(data: any) {
    this.studentsService.updateStudentDetails(data);
  }

  onSubmitStudentSpecialDetails(data: any) {
    this.studentsService.updateStudentSpecialDetails(data);
  }

  onSubmitStudentContractDetails(data: any, contractFiles: { ssnFile: any; ibanFile: any; }) {
    const fileSSN = this.uploadFile(contractFiles.ssnFile);
    const fileIban = this.uploadFile(contractFiles.ibanFile);
    this.studentsService.updateStudentContractDetails(data);
    // this.studentsService.updateStudentContractSSNFile(fileSSN);
    // this.studentsService.updateStudentContractIbanFile(fileIban);
    let err = false;
    this.studentsService.updateStudentContractSSNFile(fileSSN)
      .pipe(
        mergeMap(this.studentsService.updateStudentContractIbanFile(fileIban)
        )
      );
  }

  onSubmitStudentContact(data: any) {
    this.studentsService.updateStudentContact(data);
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