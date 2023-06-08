import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-accommodation',
  templateUrl: './accommodation.component.html',
  styleUrls: ['./accommodation.component.css']
})

export class accommodationComponent implements OnInit {
  filesSubmitted: any = {
    "fileOikogeneiakhKatastasi": false,
    "fileTautotita": false,
    "fileToposMonimhsKatoikias": false,
    "fileEpidosi": false,
    "fileVevaiwshSpoudwn": false,
    "fileYpeu8unhDilosi": false,
    "filePolutekneia": false,
    "fileBebaioshSpoudonAderfwn": false,
    "filePistopoihtikoGoneaFoithth": false,
    "fileLhksiarxikhPrakshThanatouGoneaA": false,
    "fileLhksiarxikhPrakshThanatouGoneaB": false,
    "fileAgamhMhtera": false,
    "fileGoneisAMEA": false,
    "fileGoneisAMEAIatrikhGnomateush": false,
    "fileAMEA": false,
    "fileAMEAIatrikhGnomateush": false,
    "fileGoneisThumataTromokratias1": false,
    "fileGoneisThumataTromokratias2": false,
    // "fileBebaioshEpidothsdhsAnergeias": false,
    "fileDiazevgmenoiGoneis1": false,
    "fileDiazevgmenoiGoneis2": false,
    "fileStratos": false,
    "fileYpotrofeia": false,
    "fileAporia": false,
    "fileDiavathrio": false,
    "filePistopoihtikoAlodapou": false,
    "fileEkkatharistikoAllodapou": false
  };
  isLinear = true;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  specialDataFormGroup!: FormGroup;
  studentsSSOData: Student[] = [];
  location = Utils.location;
  departmentsMap = Utils.departmentsMap;
  @ViewChild('stepper') stepper: MatStepper;

  constructor(public studentsService: StudentsService, private _formBuilder: FormBuilder, public authService: AuthService) { }

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
      fileOikogeneiakhKatastasi: ['', Validators.required],
      fileTautotita: ['', Validators.required],
      fileToposMonimhsKatoikias: ['', Validators.required],
      fileYpeu8unhDilosi: ['', Validators.required],
      fileEpidosi: ['', Validators.required],
      fileVevaiwshSpoudwn: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      filePolutekneia: [''],
      fileBebaioshSpoudonAderfwn: [''],
      filePistopoihtikoGoneaFoithth: [''],
      fileLhksiarxikhPrakshThanatouGoneaA: [''],
      fileLhksiarxikhPrakshThanatouGoneaB: [''],
      fileAgamhMhtera: [''],
      fileGoneisAMEA: [''],
      fileGoneisAMEAIatrikhGnomateush: [''],
      fileAMEA: [''],
      fileAMEAIatrikhGnomateush: [''],
      fileGoneisThumataTromokratias1: [''],
      fileGoneisThumataTromokratias2: [''],
      // fileBebaioshEpidothsdhsAnergeias: [''],
      fileDiazevgmenoiGoneis1: [''],
      fileDiazevgmenoiGoneis2: [''],
      fileStratos: [''],
      fileYpotrofeia: [''],
      fileAporia: [''],
      fileDiavathrio: [''],
      filePistopoihtikoAlodapou: [''],
      fileEkkatharistikoAllodapou: ['']
    });

    this.specialDataFormGroup = this._formBuilder.group({
      familyIncome: ['', Validators.required],
      familyState: ['', Validators.required],
      protectedMembers: ['0', Validators.required],
      siblingsStudents: ['0', Validators.required],
      children: ['0', Validators.required]
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

  updateStudentsAllDetails() {
    const basicInfo: any = {
      father_name: this.firstFormGroup.get('fatherName')?.value,
      location: this.firstFormGroup.get('municipality')?.value,
      city: this.firstFormGroup.get('city')?.value,
      phone: this.firstFormGroup.get('phone')?.value,
    };

    const applicationData: any = {
      family_income: this.specialDataFormGroup.get('familyIncome')?.value,
      family_state: this.specialDataFormGroup.get('familyState')?.value,
      protected_members: this.specialDataFormGroup.get('protectedMembers')?.value,
      siblings_students: this.specialDataFormGroup.get('siblingsStudents')?.value,
      children: this.specialDataFormGroup.get('children')?.value,
      application_type: 'accommodation'
    };

    let applicationDetails = Object.assign(basicInfo, applicationData);

    this.onSubmitStudentBasicInfo(basicInfo);
    this.onSubmitApplicationData(applicationDetails, this.filesSubmitted);

    Swal.fire({
      title: 'Αίτηση',
      text: 'Η αίτησή σας καταχωρήθηκε, θα γίνει ο έλεγχος για το αν πληρείτε τις προϋποθέσεις',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      const currentURL = window.location.href;
      const baseURL = currentURL.substring(0, currentURL.lastIndexOf('student'));
      window.location.href = baseURL + "student/applications/" + this.authService.getSessionId();
    });
  }

  areFilesUploaded() {
    // TODO check if it's right
    let trueElements = Object.keys(this.filesSubmitted).filter(el => this.filesSubmitted[el] == true);
    let trueElementsCount = trueElements.length;

    if (trueElementsCount == 6) {
      this.stepper.selected.completed = true;
      this.stepper.next(); // Move to next step
      return;
    }

    Swal.fire({
      title: 'Αποτυχία',
      text: 'Πρέπει να ανεβάσετε όλα τα αρχεία που ζητούνται',
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });

    this.stepper.selected.completed = false;
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  receiveFile(fileParam: string) {
    try {
      let formGroup = (this.secondFormGroup.contains(fileParam)) ? this.secondFormGroup : this.thirdFormGroup;
      const file = (formGroup.get(fileParam)?.value.files[0]);
      window.open(window.URL.createObjectURL(file));
    } catch (exc) {
      Swal.fire({
        title: 'Προβολή Αρχείου',
        text: 'Δεν έχετε επιλέξει αρχείο προς ανέβασμα.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
    }
  }

  onSubmitFile(fileParam: string) {
    try {
      let formGroup = (this.secondFormGroup.contains(fileParam)) ? this.secondFormGroup : this.thirdFormGroup;
      const filename = formGroup.get(fileParam)?.value._fileNames;

      if (filename.length > 100) {
        Utils.onFileLengthError();
        return;
      }
      const file = this.uploadFile(formGroup.get(fileParam)?.value);
      const fileToSend = "acc" + fileParam;

      this.studentsService.uploadFile(file, fileToSend).subscribe((res: { status: any; }) => {
        console.log("debug upload" + res.status);
        if (res.status == "success") {
          this.filesSubmitted[fileParam] = true;
          console.log(this.filesSubmitted[fileParam]);
          Utils.onFileUpload();
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Ανέβασμα Αρχείου',
        text: 'Δεν έχετε επιλέξει αρχείο. Παρακαλώ πατήστε στην αναζήτηση και επιλέξτε το αρχείο που επιθυμείτε να ανεβάσετε.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
    }
  }

  onSubmitStudentBasicInfo(data: any) {
    this.studentsService.updateStudentBasicInfo(data);
  }

  onSubmitStudentBasicDocuments(data: any) {
    this.studentsService.updateStudentBasicDocuments(data);
  }

  onSubmitApplicationData(data: any, filesSubmitted: any) {
    this.studentsService.updateStudentSpecialData(data, filesSubmitted);
  }

  validateFiles(formFileName: string) {
    this.filesSubmitted[formFileName] = false;
    let formGroup = (this.secondFormGroup.contains(formFileName)) ? this.secondFormGroup : this.thirdFormGroup;
    let formFile = formGroup.get(formFileName)?.value;

    if (formFile == null) {
      return;
    }

    let fileName = formFile._fileNames;
    if (!this.getExtensionExists(fileName)) {
      Utils.onError();
      formGroup.get(formFileName)?.setValue(null);
      formGroup.get(formFileName).reset();
      return;
    }

    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'pdf':
        console.log('Allowed file format');
        break;
      default:
        Utils.onError();
        formGroup.get(formFileName)?.setValue(null);
        formGroup.get(formFileName).reset();
        break;
    }

    let fileSize = Number((formFile.files[0].size / (1024 * 1024)).toFixed(2));

    if (fileSize > 4) {
      Swal.fire({
        title: 'Ανέβασμα Αρχείου',
        text: 'Το αρχείο είναι μεγαλύτερο απο 4 Mb.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
      formGroup.get(formFileName)?.setValue(null);
      formGroup.get(formFileName).reset();
    }
  }

  getExtensionExists(filename: string) {
    return !(filename.split('.').pop() == filename);
  }

  clearState() {
    this.specialDataFormGroup.get('siblingsStudents')?.setValue(0);
    this.specialDataFormGroup.get('protectedMembers')?.setValue(0);
    this.specialDataFormGroup.get('children')?.setValue(0);
  }

}

