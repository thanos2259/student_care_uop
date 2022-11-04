import { Component, OnInit } from '@angular/core';
import { Application } from '../application.model';
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

  constructor(public studentService: StudentsService) { }

  ngOnInit(): void {
    this.studentService.getApplication()
      .subscribe((applications: Application[]) => {
        this.studentApplications = applications;
        this.dataSource = this.studentApplications;
      })
  }

// make html printable
  printToPdf(): void {
    let printContents="", popupWin;

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
        <body onload="window.print();window.close()">${printContents}

          <p style="text-align: center;"><strong><u>ΑΙΤΗΣΗ ΠΑΡΟΧΗΣ ΔΩΡΕΑΝ ΣΤΕΓΑΣΗΣ ΓΙΑ ΤΟ ΑΚΑΔ. ΕΤΟΣ 2019-2020</u></strong></p>
          <table style="width: 100%;">
              <tbody>
                  <tr style="vertical-align: top;">
                      <td style="border: none; width: 50.0000%;">
                          <div style="text-align: center;"><br><strong>ΑΤΟΜΙΚΑ ΣΤΟΙΧΕΙΑ</strong><br><br></div>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 50.0000%;">Επώνυμο</td>
                                      <td style="width: 50.0000%;">Georgiou</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Όνομα</td>
                                      <td style="width: 50.0000%;">Kostas</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Πατρώνυμο</td>
                                      <td style="width: 50.0000%;">Hlias</td>
                                  </tr>
                              </tbody>
                          </table><br>
                          <div style="text-align: center;"><strong>ΣΤΟΙΧΕΙΑ ΤΜΗΜΑΤΟΣ</strong></div>
                          <br>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 50.0000%;">Τμήμα</td>
                                      <td style="width: 50.0000%;">plhroforikhs</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Αρ. Μητρ.</td>
                                      <td style="width: 50.0000%;">20231010110</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Εγγραφή</td>
                                      <td style="width: 50.0000%;">01/09/15</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Εισαγωγή</td>
                                      <td style="width: 50.0000%;">13/09/15</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Δικαιούχος</td>
                                      <td style="width: 50.0000%;">Hlias Georgiou</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Δήμος</td>
                                      <td style="width: 50.0000%;">Patron</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Διεύθυνση</td>
                                      <td style="width: 50.0000%;">Karaiskou 34</td>
                                  </tr>
                                  <tr>
                                      <td style="width: 50.0000%;">Τηλέφωνο</td>
                                      <td style="width: 50.0000%;">69736282234</td>
                                  </tr>
                              </tbody>
                          </table><br><br>
                          <div style="text-align: center;"><strong>ΟΙΚΟΓΕΝΕΙΑΚΗ ΚΑΤΑΣΤΑΣΗ</strong></div><br><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;Άγαμος Φοιτητής κάτω των 25 ετών</label><br>
                          <table style="width: 100%;"></table><br><br>
                          <div style="text-align: center;"><strong>ΕΤΗΣΙΟ ΟΙΚΟΓΕΝΕΙΑΚΟ ΕΙΣΟΔΗΜΑ</strong></div>
                          <p>Δηλωθέν εισόδημα: 10000 &euro;</p>
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
                                      <td style="border: none; width: 33.4895%;">Αρ. Αιτ: 3432<br>22/08/2022<br><br></td>
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
                          </table><br><input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;Pistopoihtiko Oikogeneiakhs Katastashs</label><br><label for="vehicle1"><input type="checkbox" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;Antigrafo Astunomikhs Tautothtas</label></label><br><label for="vehicle1"><label for="vehicle1"><input type="checkbox" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;Eggrafo pistopoihshs tupou monimhs katoikias</label></label></label><br><label for="vehicle1"><label for="vehicle1"><label for="vehicle1"><input type="checkbox" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbsp;Ypeuthunh Dhlwsh N 1599</label></label></label></label><br><label for="vehicle1"><label for="vehicle1"><label for="vehicle1"><label for="vehicle1"><input type="checkbox" name="vehicle1" value="Bike" checked="true"><label for="vehicle1">&nbspEkka8aristiko shmeioma eforias</label></label></label></label></label>
                          <table style="width: 100%;"></table>
                          <p><br></p>
                          <table style="width: 100%;">
                              <tbody>
                                  <tr>
                                      <td style="width: 100.0000%;">Σημείωση: Τα άρθρα αναφέρονται στην Κ.Υ.Α "Καθαρισμός όρων, προϋποθέσεων και διαδικασίας για την παροχή δωρεάν στέγασης στους φοιτητές των Α.Ε.Ι" ΦΕΚ' τ. Β' 1965/18-06-2012</td>
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

}


