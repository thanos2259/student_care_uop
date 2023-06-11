import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { FilesAccommodation } from 'src/app/students/files-accommodation.model';
import { StudentsService } from 'src/app/students/student.service';

@Component({
  selector: 'app-app-view-dialog-accommodation',
  templateUrl: './app-view-dialog-accommodation.component.html',
  styleUrls: ['./app-view-dialog-accommodation.component.css']
})
export class AppViewDialogAccommodationComponent implements OnInit {
  appFiles!: any[];
  departmentsMap = Utils.departmentsMap;
  public filesAccommodation: FilesAccommodation = {
    oikogeneiakhKatastasi: false,
    pistopoihtikoGoneaFoithth: false,
    tautotita: false,
    toposMonimhsKatoikias: false,
    ypeu8unhDilosi: false,
    polutekneia: false,
    bebaioshSpoudonAderfwn: false,
    agamhMhtera: false,
    lhksiarxikhPrakshThanatouGoneaA: false,
    lhksiarxikhPrakshThanatouGoneaB: false,
    goneisAMEA: false,
    goneisAMEAIatrikhGnomateush: false,
    goneisThumataTromokratias1: false,
    goneisThumataTromokratias2: false,
    diazevgmenoiGoneis1: false,
    diazevgmenoiGoneis2: false,
    AMEA: false,
    AMEAIatrikhGnomateush: false,
    epidosi: false,
    vevaiwshSpoudwn: false,
    stratos: false,
    ypotrofeia: false,
    aporia: false,
    diavathrio: false,
    pistopoihtikoAlodapou: false,
    ekkatharistikoAllodapou: false
  };
  fileFieldsText: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppViewDialogAccommodationComponent>, public studentService: StudentsService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  viewFile(filesMealsModelParam: string) {
    const MEALS_ABBR: 'mea' | 'acc' = 'acc';
    const studentId: number = this.data.studentsData[this.data.index].sso_uid;
    const appId: number = this.data.studentsData[this.data.index].app_id;
    const fileName: string = MEALS_ABBR + Utils.mapFilesAccommodationModelToFilenames[filesMealsModelParam];

    this.studentService.sendFileByType(studentId, fileName, MEALS_ABBR).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  updateSpecialFields(value: string | number, field: string) {
    const appId: number = this.data.studentsData[this.data.index].app_id;
    // alert('mia xara' + value);
    // alert('dyo xarites' + this.data.studentsData[this.data.index].app_id)
    this.studentService.updateSpecialField(appId, value, field)
      .subscribe((res: any) => {
        if (res) {
          location.reload();
        }
      });
  }

  ngOnInit(): void {
    this.studentService.getAccommodationFiles(this.data.appId)
      .subscribe((files: any[]) => {
        console.log(files);
        this.appFiles = files;
        for (let item of this.appFiles) {
          if (!item.value) continue;

          if (item.name == 'filePolutekneia') {
            this.filesAccommodation.polutekneia = true;
          } else if (item.name == 'filePistopoihtikoGoneaFoithth') {
            this.filesAccommodation.pistopoihtikoGoneaFoithth = true;
          } else if (item.name == 'fileBebaioshSpoudonAderfwn') {
            this.filesAccommodation.bebaioshSpoudonAderfwn = true;
          } else if (item.name == 'fileAgamhMhtera') {
            this.filesAccommodation.agamhMhtera = true;
          } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaA') {
            this.filesAccommodation.lhksiarxikhPrakshThanatouGoneaA = true;
          } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaB') {
            this.filesAccommodation.lhksiarxikhPrakshThanatouGoneaB = true;
          } else if (item.name == 'fileGoneisAMEA') {
            this.filesAccommodation.goneisAMEA = true;
          } else if (item.name == 'fileGoneisAMEAIatrikhGnomateush') {
            this.filesAccommodation.goneisAMEAIatrikhGnomateush = true;
          } else if (item.name == 'fileGoneisThumataTromokratias1') {
            this.filesAccommodation.goneisThumataTromokratias1 = true;
          } else if (item.name == 'fileGoneisThumataTromokratias2') {
            this.filesAccommodation.goneisThumataTromokratias2 = true;
          } else if (item.name == 'fileDiazevgmenoiGoneis1') {
            this.filesAccommodation.diazevgmenoiGoneis1 = true;
          } else if (item.name == 'fileDiazevgmenoiGoneis2') {
            this.filesAccommodation.diazevgmenoiGoneis2 = true;
          } else if (item.name == 'fileAMEA') {
            this.filesAccommodation.AMEA = true;
          } else if (item.name == 'fileAMEAIatrikhGnomateush') {
            this.filesAccommodation.AMEAIatrikhGnomateush = true;
          } else if (item.name == 'fileStratos') {
            this.filesAccommodation.stratos = true;
          } else if (item.name == 'fileYpotrofeia') {
            this.filesAccommodation.ypotrofeia = true;
          } else if (item.name == 'fileAporia') {
            this.filesAccommodation.aporia = true;
          } else if (item.name == 'fileDiavathrio') {
            this.filesAccommodation.diavathrio = true;
          } else if (item.name == 'filePistopoihtikoAlodapou') {
            this.filesAccommodation.pistopoihtikoAlodapou = true;
          } else if (item.name == 'fileEkkatharistikoAllodapou') {
            this.filesAccommodation.ekkatharistikoAllodapou = true;
          }

          this.fileFieldsText += `<input type="checkbox" id="file${item.description}" name="file${item.description}" checked="true">
          <label for="file${item.description}">&nbsp;${item.description}</label><br>`;
          this.fileFieldsText = this.fileFieldsText.replace('undefined', ' ');
        }
      });
  }

  printToPdf(idx: number): void {
    let popupWin: Window;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=auto');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          tr, td, th { border: none; }
          </style>
        </head>
        <body onload="window.print();window.close()">
          <p style="text-align: center;"><strong><u>ΑΙΤΗΣΗ ΠΑΡΟΧΗΣ ΔΩΡΕΑΝ
          ${this.data.studentsData[idx].application_type == 'accommodation' ? 'ΣΤΕΓΑΣΗΣ' : 'ΣΙΤΙΣΗΣ'}
           ΓΙΑ ΤΟ ΑΚΑΔ. ΕΤΟΣ ${new Date().getFullYear() - 1} - ${new Date().getFullYear()} </u></strong></p>
          <table style="width: 100%;">
              <tbody>
                  <tr style="vertical-align: top;">
                      <td style="border: none; width: 50.0000%;">
                          <div style="text-align: center;"><br><strong>ΑΤΟΜΙΚΑ ΣΤΟΙΧΕΙΑ</strong><br><br></div>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 50.0000%;">Επώνυμο</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[0].sn}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Όνομα</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[0].givenname}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Πατρώνυμο</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[idx].father_name}</td>
                                  </tr>
                              </tbody>
                          </table><br>
                          <div style="text-align: center;"><strong>ΣΤΟΙΧΕΙΑ ΤΜΗΜΑΤΟΣ</strong></div>
                          <br>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 50.0000%;">Τμήμα</td>
                                      <td style="width: 50.0000%;">
                                          ${this.data.studentsData[0].department_id = this.departmentsMap[this.data.studentsData[0].department_id]}
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Αρ. Μητρ.</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[0].schacpersonaluniquecode}</td>
                                  </tr>
                                  <!--<tr>
                                      <td style="width: 50.0000%;">Εγγραφή</td>
                                      <td style="width: 50.0000%;"></td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Εισαγωγή</td>
                                      <td style="width: 50.0000%;"></td>
                                  </tr>-->
                                  <tr>
                                      <td style="width: 50.0000%;">Δικαιούχος</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[0].displayname}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Δήμος</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[idx].location}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Διεύθυνση</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[0].address}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Τηλέφωνο</td>
                                      <td style="width: 50.0000%;">${this.data.studentsData[idx].phone}</td>
                                  </tr>
                              </tbody>
                          </table><br><br>
                          <div style="text-align: center;"><strong>ΟΙΚΟΓΕΝΕΙΑΚΗ ΚΑΤΑΣΤΑΣΗ</strong></div><br>
                          <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;${this.data.studentsData[idx].family_state}</label><br>
                          <div>${this.getFamilyStateSubfields(idx)}</div>
                          <table style="width: 100%;"></table><br><br>
                          <div style="text-align: center;"><strong>ΕΤΗΣΙΟ ΟΙΚΟΓΕΝΕΙΑΚΟ ΕΙΣΟΔΗΜΑ</strong></div>
                          <p>Δηλωθέν εισόδημα: ${this.data.studentsData[idx].family_income} &euro;</p>
                          <p><br></p>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="border: 1px solid black; width: 100.0000%;">Την αίτηση και τα πρωτότυπα δικαιολογητικά έγγραφα θα τα κρατήσετε και θα τα προσκομίσετε στο Τμήμα Φοιτητικής Μέριμνας, όταν σας ζητηθεί από την Υπηρεσία.</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                      <td style="border: none; vertical-align: top; width: 50.0000%;">
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="border: none;width: 33.0000%;"><br></td>
                                      <td style="border: none; width: 33.4894%;">
                                          <div style="text-align: center;"><strong>ΠΡΟΣ&nbsp;</strong></div>
                                      </td>
                                      <td style="border: none; width: 33.4895%;">Αρ. Αιτ: ${this.data.studentsData[idx].id} <br>${this.data.studentsData[idx].submit_date}<br><br></td>
                                  </tr>
                              </tbody>
                          </table>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="border:none; width: 100.0000%;"><strong>Τμήμα Φοιτητικής Μέριμνας Πανεπιστήμιο Πελοποννήσου</strong><br>Σας υποβάλλω τα συννημένα δικαιολογητικά για παροχή δωρεάν σίτισης στο τρέχον ακαδημαϊκό έτος.</td>
                                  </tr>
                              </tbody>
                          </table><br>
                          <div style="text-align: center;">Πάτρα, &nbsp; &nbsp; &nbsp; / &nbsp; &nbsp; &nbsp; /<br><br></div>
                          <div style="text-align: center;">Ο/Η Αιτών/ούσα</div>
                          <p><br></p>
                          <p><br></p>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="border: none; width: 50.0000%;">
                                          <div style="text-align: center;"><strong>ΣΥΝΗΜΜΕΝΑ ΔΙΚΑΙΟΛΟΓΗΤΙΚΑ</strong></div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table><br>
                          ${this.fileFieldsText}
                          <table style="width: 100%;"></table>
                          <p><br></p>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 100.0000%; font-size: 10px; ${this.data.studentsData[idx].application_type == 'accommodation' ? 'display:none;' : ''}">Σημείωση: Τα άρθρα αναφέρονται στην Κ.Υ.Α "Καθαρισμός όρων, προϋποθέσεων και διαδικασίας για την παροχή δωρεάν σίτισης στους φοιτητές των Α.Ε.Ι" ΦΕΚ' τ. Β' 1965/18-06-2012</td>
                                  </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
          <p><br></p>
        </body>
      </html>`
    );
    popupWin!.document.close();
  }

  getFamilyStateSubfields(appArrayIndex: number) {
    switch (this.data.studentsData[appArrayIndex].family_state) {
      case 'Άγαμος φοιτητής/φοιτήτρια κάτω των 25 ετών':
        return `<ul>
          <li>
            Αριθμός προστατευόμενων τέκνων οικογένειας: ${this.data.studentsData[appArrayIndex].protected_members}
          </li>
          <li>
            Αριθμός αδελφών που είναι ενεργοί φοιτητές / φοιτήτριες πρώτου κύκλου σπουδών: ${this.data.studentsData[appArrayIndex].siblings_students}
          </li>
        </ul>`;
      case 'Έγγαμος φοιτητής/φοιτήτρια':
        return `<ul>
          <li>
            Αριθμός ανήλικων τέκνων: ${this.data.studentsData[appArrayIndex].children}
          </li>
        </ul>`;
      default:
        return '';
    }
  }
}
