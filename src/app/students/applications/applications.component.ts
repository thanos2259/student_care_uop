import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { Application } from '../application.model';
import { Student } from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})

export class ApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['application', 'applicationNumber', 'date', 'status', 'actions'];
  studentApplications!: Application[];
  dataSource!: any;
  studentsSSOData: any;
  departmentsMap = Utils.departmentsMap;
  accommodationFiles!: any[];
  fileFieldsText: string[] = [];

  constructor(public studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.getApplication()
      .subscribe((applications: Application[]) => {
        this.studentApplications = applications;
        this.dataSource = this.studentApplications;

        // needs refactoring
        // it's fetch accommodation files for each application only when needed
        // (when the user clicks on the button)
        for (let i = 0; i < this.studentApplications.length; i++) {
          this.studentService.getAccommodationFiles(this.studentApplications[i].id)
            .subscribe((files: any[]) => {
              this.accommodationFiles = files;
              // function did not properly worked after redirecting to another component
              // so we finally implemented it with another for
              for (let j = 0; j < this.accommodationFiles.length; j++) {
                this.fileFieldsText[i] += `<input type="checkbox" id="file${j}" name="file${j}" checked="true">
                <label for="file${j}">&nbsp;${this.accommodationFiles[j].description}</label><br>`;
                this.fileFieldsText[i] = this.fileFieldsText[i].replace('undefined', ' ');
              }
            });
        }
      });
    this.studentService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsSSOData[0].schacpersonaluniquecode = Utils.getRegistrationNumber(this.studentsSSOData[0].schacpersonaluniquecode);
        this.studentsSSOData[0].department_id = this.departmentsMap[this.studentsSSOData[0].department_id];
      });
  }

  // make html printable
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
          ${this.studentApplications[idx].application_type == 'accommodation' ? 'ΣΤΕΓΑΣΗΣ' : 'ΣΙΤΙΣΗΣ'}
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
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].sn}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Όνομα</td>
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].givenname}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Πατρώνυμο</td>
                                      <td style="width: 50.0000%;">${this.studentApplications[idx].father_name}</td>
                                  </tr>
                              </tbody>
                          </table><br>
                          <div style="text-align: center;"><strong>ΣΤΟΙΧΕΙΑ ΤΜΗΜΑΤΟΣ</strong></div>
                          <br>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 50.0000%;">Τμήμα</td>
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].department_id}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Αρ. Μητρ.</td>
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].schacpersonaluniquecode}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Εγγραφή</td>
                                      <td style="width: 50.0000%;"></td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Εισαγωγή</td>
                                      <td style="width: 50.0000%;"></td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Δικαιούχος</td>
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].displayname}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Δήμος</td>
                                      <td style="width: 50.0000%;">${this.studentApplications[idx].location}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Διεύθυνση</td>
                                      <td style="width: 50.0000%;">${this.studentsSSOData[0].address}</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Τηλέφωνο</td>
                                      <td style="width: 50.0000%;">${this.studentApplications[idx].phone}</td>
                                  </tr>
                              </tbody>
                          </table><br><br>
                          <div style="text-align: center;"><strong>ΟΙΚΟΓΕΝΕΙΑΚΗ ΚΑΤΑΣΤΑΣΗ</strong></div><br>
                          <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;${this.studentApplications[idx].family_state}</label><br>
                          <div>${this.getFamilyStateSubfields(idx)}</div>
                          <table style="width: 100%;"></table><br><br>
                          <div style="text-align: center;"><strong>ΕΤΗΣΙΟ ΟΙΚΟΓΕΝΕΙΑΚΟ ΕΙΣΟΔΗΜΑ</strong></div>
                          <p>Δηλωθέν εισόδημα: ${this.studentApplications[idx].family_income} &euro;</p>
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
                                      <td style="border: none; width: 33.4895%;">Αρ. Αιτ: ${this.studentApplications[idx].id} <br>${this.studentApplications[idx].submit_date}<br><br></td>
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
                          ${this.fileFieldsText[idx]}
                          <table style="width: 100%;"></table>
                          <p><br></p>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 100.0000%; font-size: 10px; ${this.studentApplications[idx].application_type == 'accommodation' ? 'display:none;' : ''}">Σημείωση: Τα άρθρα αναφέρονται στην Κ.Υ.Α "Καθαρισμός όρων, προϋποθέσεων και διαδικασίας για την παροχή δωρεάν σίτισης στους φοιτητές των Α.Ε.Ι" ΦΕΚ' τ. Β' 1965/18-06-2012</td>
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
    switch (this.studentApplications[appArrayIndex].family_state) {
      case 'Άγαμος φοιτητής/φοιτήτρια κάτω των 25 ετών':
        return `<ul>
          <li>
            Αριθμός προστατευόμενων τέκνων οικογένειας: ${this.studentApplications[appArrayIndex].protected_members}
          </li>
          <li>
            Αριθμός αδελφών που είναι ενεργοί φοιτητές / φοιτήτριες πρώτου κύκλου σπουδών: ${this.studentApplications[appArrayIndex].siblings_students}
          </li>
        </ul>`;
      case 'Έγγαμος φοιτητής/φοιτήτρια':
        return `<ul>
          <li>
            Αριθμός ανήλικων τέκνων: ${this.studentApplications[appArrayIndex].children}
          </li>
        </ul>`;
      default:
        return '';
    }
  }

}


