import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { FilesMeals } from 'src/app/students/files-meals.model';
import { StudentsService } from 'src/app/students/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-view-dialog',
  templateUrl: './app-view-dialog.component.html',
  styleUrls: ['./app-view-dialog.component.css']
})
export class AppViewDialogComponent implements OnInit {
  appFiles!: any[];
  departmentsMap = Utils.departmentsMap;
  public filesMeals: FilesMeals = {
    eka8aristiko: false,
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
    bebaioshEpidothsdhsAnergeias: false,
    diazevgmenoiGoneis1: false,
    diazevgmenoiGoneis2: false,
    AMEA: false,
    AMEAIatrikhGnomateush: false,
  };
  fileFieldsText: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AppViewDialogComponent>, public studentService: StudentsService
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  viewFile(filesMealsModelParam: string) {
    const MEALS_ABBR: 'mea' | 'acc' = 'mea';
    const studentId: number = this.data.studentsData[this.data.index].uuid;
    const appId: number = this.data.studentsData[this.data.index].app_id;
    const fileName: string = MEALS_ABBR + Utils.mapFilesMealsModelToFilenames[filesMealsModelParam];

    this.studentService.sendFileByType(studentId, fileName, MEALS_ABBR).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  updateSpecialFields(value: string | number, field: string) {
    const appId: number = this.data.studentsData[this.data.index].app_id;
    this.studentService.updateSpecialField(appId, value, field)
      .subscribe((res: any) => {
        if (res) {
          location.reload();
        }
      });
  }

  updateOptionalFileStatus(filenames: string[]) {
    if (!filenames || filenames?.length == 0) return;
    // Set the new status value here (false because we need to deactivate the fields)
    const value: boolean = false;
    this.studentService.updateOptionalFilesStatus(this.data.appId, filenames, value)
      .subscribe((res: any) => {
        if (res) {
          Swal.fire({
            title: 'Απενεργοποίηση',
            text: 'Το έγγραφο απενεργοποιήθηκε',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ΟΚ'
          }).then(() => {
            for (let filename of filenames) {
              this.filesMeals[filename] = false;
            }
          });
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
            this.filesMeals.polutekneia = true;
          } else if (item.name == 'filePistopoihtikoGoneaFoithth') {
            this.filesMeals.pistopoihtikoGoneaFoithth = true;
          } else if (item.name == 'fileBebaioshSpoudonAderfwn') {
            this.filesMeals.bebaioshSpoudonAderfwn = true;
          } else if (item.name == 'fileAgamhMhtera') {
            this.filesMeals.agamhMhtera = true;
          } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaA') {
            this.filesMeals.lhksiarxikhPrakshThanatouGoneaA = true;
          } else if (item.name == 'fileLhksiarxikhPrakshThanatouGoneaB') {
            this.filesMeals.lhksiarxikhPrakshThanatouGoneaB = true;
          } else if (item.name == 'fileGoneisAMEA') {
            this.filesMeals.goneisAMEA = true;
          } else if (item.name == 'fileGoneisAMEAIatrikhGnomateush') {
            this.filesMeals.goneisAMEAIatrikhGnomateush = true;
          } else if (item.name == 'fileGoneisThumataTromokratias1') {
            this.filesMeals.goneisThumataTromokratias1 = true;
          } else if (item.name == 'fileGoneisThumataTromokratias2') {
            this.filesMeals.goneisThumataTromokratias2 = true;
          } else if (item.name == 'fileBebaioshEpidothsdhsAnergeias') {
            this.filesMeals.bebaioshEpidothsdhsAnergeias = true;
          } else if (item.name == 'fileDiazevgmenoiGoneis1') {
            this.filesMeals.diazevgmenoiGoneis1 = true;
          } else if (item.name == 'fileDiazevgmenoiGoneis2') {
            this.filesMeals.diazevgmenoiGoneis2 = true;
          } else if (item.name == 'fileAMEA') {
            this.filesMeals.AMEA = true;
          } else if (item.name == 'fileAMEAIatrikhGnomateush') {
            this.filesMeals.AMEAIatrikhGnomateush = true;
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
                          <div style="text-align: center;"> Ημερομηνία: &nbsp; &nbsp; &nbsp; / &nbsp; &nbsp; &nbsp; /<br><br></div>
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
