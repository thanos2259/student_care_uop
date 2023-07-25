import { Component, OnInit } from '@angular/core';
import {Utils} from 'src/app/MiscUtils';
import {StudentsService} from 'src/app/students/student.service';
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

  exportToGenericExcel(selectedYearValue: number) {
    this.studentsService.getStudentAppsByYear(selectedYearValue, 'meals')
      .subscribe((res: any) => {
        let studentsDataJson: any = [];
        for (const item of res) {
          const itemIndex = res.indexOf(item);

          const studentData = {
            "Α/Α": itemIndex + 1,
            // "ΚΑΤΗΓΟΡΙΑ": this.isSpecialCategory ? "1" : "2",
            "TMHMA": this.getDepartmentNameById(Number(item.department_id)),
            "ΑΜ": Utils.getRegistrationNumber(item.schacpersonaluniquecode),
            "Επώνυμο": item.sn,
            "Όνομα": item.givenname,
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

  getDepartmentNameById(depId: number) {
    return Utils.departmentsMap[depId];
  }

}
