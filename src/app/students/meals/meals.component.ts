import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import Swal from 'sweetalert2';
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
      });
    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: [],
      surnameCtrl: [],
      fatherNameCtrl: ['', Validators.required]
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

  // This function is used to get the AMKA number of the student
  private getSSN(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
    const fieldValue = givenFormGroup.get(field)?.value;
    return fieldValue && fieldValue != null && fieldValue != '';
  }

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
      father_name: this.firstFormGroup.get('fatherNameCtrl')?.value,
      father_last_name: this.firstFormGroup.get('fatherSurnameCtrl')?.value,
      mother_name: this.firstFormGroup.get('motherNameCtrl')?.value,
      mother_last_name: this.firstFormGroup.get('motherSurnameCtrl')?.value
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
    this.setPhase(1);
    this.onSave();
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

  setPhase(phase: number) {

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

  onSave() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  onErr() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Μη έγκυρος τύπος αρχείων. Υποστηριζόμενος τύπος αρχέιων: .pdf .jpg .png .webp .jpeg .gif .doc .docx',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  validateFiles(docType: string) {
    let ssnFile = this.secondFormGroup.get(docType)?.value;
    if (ssnFile == null) {
      return;
    }
    let fileName = ssnFile._fileNames;
    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'pdf':
      case 'png':
      case 'doc':
      case 'docx':
      case 'gif':
      case 'webp':
        console.log('Allowed file format');
        break;
      default:
        this.onErr();
        this.secondFormGroup.get(docType)?.setValue(null);
        break;
    }
  }

}
