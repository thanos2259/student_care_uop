import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs';
import Swal from 'sweetalert2';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})

/**
 * @title enable practice with vertical stepper
 */
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
        this.studentsSSOData[0].schacpersonaluniquecode = this.getRegistrationNumber(this.studentsSSOData[0].schacpersonaluniquecode);
        this.studentsSSOData[0].department_id = this.departmentsMap[this.studentsSSOData[0].department_id];
      });

    this.firstFormGroup = this._formBuilder.group({
      nameCtrl: [],
      surnameCtrl: [],
      fatherNameCtrl: ['', Validators.required],
      registrationNumber: [],
      depName: []
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

  private getRegistrationNumber(str: string): string {
    const registrationNumber = str.split(":");
    return registrationNumber[8];
  }

  checkIfFieldEmpty(givenFormGroup: FormGroup, field: string): boolean {
    const fieldValue = givenFormGroup.get(field)?.value;
    return fieldValue && fieldValue != null && fieldValue != '';
  }

  departmentsMap = {
    '98': 'ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ',
    '104': 'ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ',
    '1511': 'ΓΕΩΠΟΝΙΑΣ',
    '1512': 'ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ',
    '1513': 'ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ',
    '1514': 'ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ',
    '1515': 'ΛΟΓΟΘΕΡΑΠΕΙΑΣ',
    '1516': 'ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ',
    '1517': 'ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ',
    '1518': 'ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ',
    '1519': 'ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ',
    '1520': 'ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ',
    '1522': 'ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1523': 'ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1524': 'ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '187': 'ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ',
    '189': 'ΦΙΛΟΛΟΓΙΑΣ',
    '190': 'ΝΟΣΗΛΕΥΤΙΚΗΣ',
    '361': 'ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ',
    '362': 'ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ',
    '400': 'ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ',
    '411': 'ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ'
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

