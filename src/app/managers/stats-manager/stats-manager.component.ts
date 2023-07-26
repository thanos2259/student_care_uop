import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import {FilesAccommodation} from 'src/app/students/files-accommodation.model';
import { FilesMeals } from 'src/app/students/files-meals.model';
import {StudentApplication} from 'src/app/students/student-application.model';
import { StudentsService } from 'src/app/students/student.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-stats-manager',
  templateUrl: './stats-manager.component.html',
  styleUrls: ['./stats-manager.component.css']
})
export class StatsManagerComponent implements OnInit {
  years: number[] = [2021, 2022, 2023];
  selectedYear: number;
  selectedYear2: number;
  selectedYearAcc: number;
  selectedYearAcc2: number;
  selectedDepartment: string;

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void { }

  exportToExcel(selectedYearValue: number) {
    this.studentsService.getStudentsCountByYearAndDepartment(selectedYearValue, 'meals')
      .subscribe((res: any) => {
        let cnt: number = 0;
        let finalRow;

        let statsDataJson: any = [];
        for (const item of res) {
          const itemIndex = res.indexOf(item);
          if (itemIndex == (res.length - 1)) {
            finalRow = {"ΣΥΝΟΛΟ": cnt}
          }
          cnt++;
          statsDataJson.push({
            "Α/Α": itemIndex + 1,
            "ΕΤΟΣ": item.acyear,
            "ΤΜΗΜΑ": this.getDepartmentNameById(Number(res['department_id'])),
            "ΟΛΑ": Number(item.all_results),
            "ΔΙΚΑΙΟΥΧΟΙ": Number(item.pass),
            "ΑΠΟΡΡΙΠΤΟΜΕΝΟΙ": Number(item.fail)
          });
        }

        const excelFileName: string = "StudentsPhase1Accommodation.xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(statsDataJson);
        XLSX.utils.sheet_add_json(ws, [finalRow],  { origin: { r: -1, c: 4 }});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ΣΥΝΟΛΟ');

        /* Save to file */
        XLSX.writeFile(wb, excelFileName);
      });
  }

  exportToExcelAcc(selectedYearValue: number) {
    this.studentsService.getStudentsCountByYearAndDepartment(selectedYearValue, 'accommodation')
      .subscribe((res: any) => {
        let cnt: number = 0;
        let finalRow;

        let statsDataJson: any = [];
        for (const item of res) {
          const itemIndex = res.indexOf(item);
          if (itemIndex == (res.length - 1)) {
            finalRow = {"ΣΥΝΟΛΟ": cnt}
          }
          cnt++;
          statsDataJson.push({
            "Α/Α": itemIndex + 1,
            "ΕΤΟΣ": item.acyear,
            "ΤΜΗΜΑ": this.getDepartmentNameById(Number(res['department_id'])),
            "ΟΛΑ": Number(item.all_results),
            "ΔΙΚΑΙΟΥΧΟΙ": Number(item.pass),
            "ΑΠΟΡΡΙΠΤΟΜΕΝΟΙ": Number(item.fail)
          });
        }

        const excelFileName: string = "StudentsPhase1Accommodation.xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(statsDataJson);
        XLSX.utils.sheet_add_json(ws, [finalRow],  { origin: { r: -1, c: 4 }});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ΣΥΝΟΛΟ');

        /* Save to file */
        XLSX.writeFile(wb, excelFileName);
      });
  }

  async exportToGenericExcel(selectedYearValue: number, type: 'meals' | 'acc') {
    this.studentsService.getStudentAppsByYear(selectedYearValue, type)
      .subscribe((res: any) => {
        let studentsDataJson: any = [];

        for (const item of res) {

          const itemIndex = res.indexOf(item);

          const studentData = {
            "Α/Α": itemIndex + 1,
            "ΚΑΤΗΓΟΡΙΑ": item.application_files?.length > 0 ? "1" : "2",
            "TMHMA": this.getDepartmentNameById(Number(item.department_id)),
            "ΑΡΙΘΜΟΣ ΜΗΤΡΩΟΥ": Utils.getRegistrationNumber(item.schacpersonaluniquecode),
            "ΕΠΩΝΥΜΟ": item.sn,
            "ΟΝΟΜΑ": item.givenname,
            "ΠΑΤΡΩΝΥΜΟ": item.father_name,
            "ΑΡΙΘΜΟΣ ΑΙΤΗΣΗΣ": item.app_id,
            "ΗΜΕΡΟΜΗΝΙΑ ΑΙΤΗΣΗΣ": Utils.getPreferredTimestamp(item.submit_date),
            "E-MAIL": item.mail,
            "ΗM/NIA ΓΕΝΝΗΣΗΣ": Utils.reformatDateOfBirth(item.schacdateofbirth),
            "ΤΗΛΕΦΩΝΟ": item.phone,
            "ΠΟΛΗ": item.city,
            "ΤΚ": item.post_address,
            "ΔΙΕΥΘΥΝΣΗ": item.address,
            "ΤΟΠΟΘΕΣΙΑ": item.location,
            // "ΚΑΤΗΓΟΡΙΑ": item.category,
            "ΟΙΚΟΓΕΝΕΙΑΚΟ ΕΙΣΟΔΗΜΑ": item.family_income,
            "ΟΡΙΟ ΕΙΣΟΔΗΜΑΤΟΣ": this.calculateIncomeLimitForStudent(item),
            "ΟΙΚΟΓΕΝΕΙΑΚΗ ΚΑΤΑΣΤΑΣΗ": item.family_state,
            "ΠΡΟΣΤΑΤΕΥΟΜΕΝΑ ΜΕΛΗ": item.protected_members,
            "ΑΔΕΛΦΙΑ ΠΟΥ ΦΟΙΤΟΥΝ": item.siblings_students,
            "ΠΑΙΔΙΑ ΦΟΙΤΗΤΗ": item.children,
            "ΠΟΛΥΤΕΚΝΕΙΑ": item.application_files?.includes('filePolutekneia') ? 'ΝΑΙ' : 'ΟΧΙ',
            "ΤΡΙΤΕΚΝΟΣ Η ΦΟΙΤΗΤΗΤΣ ΓΟΝΕΑΣ": item.application_files?.includes('pistopoihtikoGoneaFoithth') ? 'ΝΑΙ' : 'OXI',
            "ΑΔΕΡΦΙΑ ΦΟΙΤΗΤΕΣ": item.application_files?.includes('bebaioshSpoudonAderfwn') ? 'ΝΑΙ' : 'OXI',
            "ΑΓΑΜΗ ΜΗΤΕΡΑ": item.application_files?.includes('agamhMhtera') ? 'ΝΑΙ' : 'OXI',
            "ΑΠΟΘΝΗΣΚΩΝ ΓΟΝΕΑΣ": item.application_files?.includes('lhksiarxikhPrakshThanatouGoneaA') || item.application_files?.includes('lhksiarxikhPrakshThanatouGoneaB') ? 'ΝΑΙ' : 'OXI',
            "ΓΟΝΕΙΣ ΑΜΕΑ": item.application_files?.includes('goneisAMEA') || item.application_files?.includes('goneisAMEAIatrikhGnomateush') ? 'ΝΑΙ' : 'OXI',
            "ΓΟΝΕΙΣ ΘΥΜΑΤΑ ΤΡΟΜΟΚΡΑΤΙΑΣ": item.application_files?.includes('goneisThumataTromokratias1') || item.application_files?.includes('goneisThumataTromokratias2') ? 'ΝΑΙ' : 'OXI',
            "ΑΝΕΡΓΟΣ/Η": item.application_files?.includes('bebaioshEpidothsdhsAnergeias') ? 'ΝΑΙ' : 'OXI',
            "ΔΙΑΓΕΥΓΜΕΝΟΙ ΓΟΝΕΙΣ": item.application_files?.includes('diazevgmenoiGoneis1') || item.application_files?.includes('diazevgmenoiGoneis2') ? 'ΝΑΙ' : 'OXI',
            "ΦΟΙΤΗΤΗΣ / ΡΙΑ ΑΜΕΑ": item.application_files?.includes('AMEA') || item.application_files?.includes('AMEAIatrikhGnomateush') ? 'ΝΑΙ' : 'OXI'
          };
          studentsDataJson.push(studentData);
        }
        const excelFileName: string = "εξαγωγή γενικής λίστας.xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* Save to file */
        XLSX.writeFile(wb, excelFileName);
      });
  }

  calculateIncomeLimitForStudent(item: any) {
    return Utils.calculateIncomeLimitForMealEligibility(item);
  }

  getDepartmentNameById(depId: number) {
    return Utils.departmentsMap[depId];
  }

}
