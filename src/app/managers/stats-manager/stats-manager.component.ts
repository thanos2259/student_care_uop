import { Component, OnInit } from '@angular/core';
import {StudentsService} from 'src/app/students/student.service';


@Component({
  selector: 'app-stats-manager',
  templateUrl: './stats-manager.component.html',
  styleUrls: ['./stats-manager.component.css']
})
export class StatsManagerComponent implements OnInit {
  years: number[] = [2021, 2022, 2023];
  selectedYear: number;
  selectedDepartment: string;

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void { }

  exportToExcel() {
    this.studentsService.getStudentsMealsCountByYearAndDepartment(this.selectedYear)
      .subscribe((res: any) => {
        console.log(res);

        // let studentsDataJson: any = [];
        // for (const item of this.studentsSSOData) {
        //   const itemIndex = this.studentsSSOData.indexOf(item);
        //   studentsDataJson.push({
        //     "Α/Α": itemIndex + 1,
        //     "ΚΑΤΗΓΟΡΙΑ": this.isSpecialCategory ? "1" : "2",
        //     "TMHMA": this.getDepartmentNameById(Number(item.department_id)),
        //     "ΑΜ": item.schacpersonaluniquecode,
        //     "Επώνυμο": item.sn,
        //     "Όνομα": item.givenname,
        //     "Πατρώνυμο": item.father_name,
        //     "Μητρώνυμο": item.mother_name,
        //     "Επώνυμο πατέρα": item.father_last_name,
        //     "Επώνυμο μητέρας": item.mother_last_name,
        //     "email": item.mail,
        //     "Ημ/νια Γέννησης": Utils.reformatDateOfBirth(item.schacdateofbirth),
        //     "Φύλο": item.schacgender == 1 ? 'Άνδρας' : 'Γυναίκα',
        //     "Τηλέφωνο": item.phone,
        //     "Πόλη": item.city,
        //     "ΤΚ": item.post_address,
        //     "Διεύθυνση": item.address,
        //     "Τοποθεσία": item.location,
        //     "Χώρα": item.country == "gr" ? 'Ελλάδα' : item.country,
        //     "Αρ. Αίτησης": item.id,
        //     "Ημ/νία Αίτησης": Utils.getPreferredTimestamp(item.submit_date),
        //     "Κατηγορία": item.category,
        //     "Οικογενειακό εισόδημα": item.family_income,
        //     "Όριο Εισοδηματος": this.calculateIncomeLimitForStudent(itemIndex),
        //     "Οικογενειακή κατάσταση": item.family_state,
        //     "Προστατευόμενα Μέλη": item.protected_members,
        //     "Αδέλφια που φοιτούν": item.siblings_students,
        //     "Παιδιά Φοιτητή": item.children,
        //     "Πολυτεκνεία": this.filesMeals.polutekneia ? 'ΝΑΙ' : 'OXI',
        //     "Τρίτεκνος ή Φοιτητής γονέας": this.filesMeals.pistopoihtikoGoneaFoithth ? 'ΝΑΙ' : 'OXI',
        //     "Αδέρφιια φοιτητές": this.filesMeals.bebaioshSpoudonAderfwn ? 'ΝΑΙ' : 'OXI',
        //     "Άγαμη Μητέρα": this.filesMeals.agamhMhtera ? 'ΝΑΙ' : 'OXI',
        //     "Αποθνήσκων γονέας": this.filesMeals.lhksiarxikhPrakshThanatouGoneaA || this.filesMeals.lhksiarxikhPrakshThanatouGoneaB ? 'ΝΑΙ' : 'OXI',
        //     "Γονείς ΑΜΕΑ": this.filesMeals.goneisAMEA || this.filesMeals.goneisAMEAIatrikhGnomateush ? 'ΝΑΙ' : 'OXI',
        //     "Γονείς Θύματα Τρομοκρατίας": this.filesMeals.goneisThumataTromokratias1 || this.filesMeals.goneisThumataTromokratias2 ? 'ΝΑΙ' : 'OXI',
        //     "Διαζευγμένοι Γονείς": this.filesMeals.diazevgmenoiGoneis1 || this.filesMeals.diazevgmenoiGoneis2 ? 'ΝΑΙ' : 'OXI',
        //     "Φοιτητής / ρια ΑΜΕΑ": this.filesMeals.AMEA || this.filesMeals.AMEAIatrikhGnomateush ? 'ΝΑΙ' : 'OXI'
        //   });
        // }

        // const excelFileName: string = "StudentsPhase1Accommodation.xlsx";
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson); //table_to_sheet((document.getElementById("example2") as HTMLElement));
        // const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // /* Save to file */
        // XLSX.writeFile(wb, excelFileName);

      });
  }

}
