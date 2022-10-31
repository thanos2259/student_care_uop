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
  thirdFormGroup!: FormGroup;
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
      fileOikogeneiakhKatastasi: ['', Validators.required],
      fileTautotita: ['', Validators.required],
      fileToposMonimhsKatoikias: ['', Validators.required],
      fileEka8aristiko: ['', Validators.required],
      fileYpeu8unhDilosi: ['', Validators.required],
      studentCategory: ['', Validators.required]
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
      fileGoneisThumataTromokratias1: [''],
      fileGoneisThumataTromokratias2: [''],
      fileBebaioshEpidothsdhsAnergeias: [''],
      fileDiazevgmenoiGoneis1: [''],
      fileDiazevgmenoiGoneis2: ['']
    });

    this.specialDataFormGroup = this._formBuilder.group({
      familyIncome: ['0', Validators.required],
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

  location = Utils.location;
  departmentsMap = Utils.departmentsMap;

  updateStudentsAllDetails() {
    const basicInfo: any = {
      father_name: this.firstFormGroup.get('fatherName')?.value,
      location: this.firstFormGroup.get('municipality')?.value,
      city: this.firstFormGroup.get('city')?.value,
      phone: this.firstFormGroup.get('phone')?.value
    };

    const basicDocs: any = {
      category: this.secondFormGroup.get('studentCategory')?.value,
    };

    const specialData: any = {
      family_income: this.specialDataFormGroup.get('familyIncome')?.value,
      family_state: this.specialDataFormGroup.get('familyState')?.value,
      protected_members: this.specialDataFormGroup.get('protectedMembers')?.value,
      siblings_students: this.specialDataFormGroup.get('siblingsStudents')?.value,
      children: this.specialDataFormGroup.get('children')?.value
    };

    this.onSubmitStudentBasicInfo(basicInfo);
    this.onSubmitStudentBasicDocuments(basicDocs);
    this.onSubmitStudentSpecialData(specialData);
    Utils.onSaveApplication();
  }

  uploadFile(fileValue: any): FormData {
    const imageBlob = fileValue?.files[0];
    const file = new FormData();
    file.set('file', imageBlob);
    return file;
  }

  onSubmitFile(fileParam: string) {
    let formGroup = (this.secondFormGroup.contains(fileParam)) ? this.secondFormGroup : this.thirdFormGroup;
    const filename = formGroup.get(fileParam)?.value._fileNames;

    if (filename.length > 100) {
      Utils.onFileLengthError();
      return;
    }
    const file = this.uploadFile(formGroup.get(fileParam)?.value);
    this.studentsService.uploadTestFile(file, fileParam).subscribe((res: { status: any; }) => {
      console.log("debug upload" + res.status);
      if (res.status == "success") {
        Utils.onFileUpload();
      }
    });
  }

  onSubmitStudentBasicInfo(data: any) {
    this.studentsService.updateStudentBasicInfo(data);
  }

  onSubmitStudentBasicDocuments(data: any) {
    this.studentsService.updateStudentBasicDocuments(data);
  }

  onSubmitStudentSpecialData(data: any) {
    this.studentsService.updateStudentSpecialData(data);
  }

  validateFiles(docType: string) {
    let formGroup = (this.secondFormGroup.contains(docType)) ? this.secondFormGroup : this.thirdFormGroup;
    let formFile = formGroup.get(docType)?.value;

    if (formFile == null) {
      return;
    }

    let fileName = formFile._fileNames;
    if (!this.getExtensionExists(fileName)) {
      Utils.onError();
      formGroup.get(docType)?.setValue(null);
      formGroup.get(docType).reset();
      return;
    }

    let ext = fileName.match(/\.([^\.]+)$/)[1];
    switch (ext) {
      case 'pdf':
        console.log('Allowed file format');
        break;
      default:
        Utils.onError();
        formGroup.get(docType)?.setValue(null);
        formGroup.get(docType).reset();
        break;
    }
  }

  getExtensionExists(filename: string) {
    return !(filename.split('.').pop() == filename);
  }

}

