import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ManagerService } from '../manager.service';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/admin-panels/admin.service';
import { AvailableCities } from '../available-cities';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[2], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[0], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
	}
}

@Component({
	selector: 'app-manager-home',
	templateUrl: './manager-home.component.html',
	styleUrls: ['./manager-home.component.css'],
	providers: [
		{ provide: NgbDateAdapter, useClass: CustomAdapter },
		{ provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
	],
})
export class ManagerHomeComponent implements OnInit {
  @ViewChild('citySelect') citySelect: ElementRef | undefined;
  @ViewChild('citySelectAcc') citySelectAcc: ElementRef | undefined;
  @ViewChild('selectedYearAcc') selectedYearAcc: ElementRef | undefined;
  @ViewChild('selectedYearMea') selectedYearMea: ElementRef | undefined;
  public isUserNafplio: boolean = false;
	ngSelect = "";
	ngSelectPhase = "";
	modelMealsDateFrom: string;
	modelMealsDateTo: string;
	modelAccommodationDateFrom: string;
	modelAccommodationDateTo: string;
  public modelAccommodationSelectedYear: string | null = null;
  public modelMealsSelectedYear: string | null = null;
  public currentYear: number = new Date().getFullYear();

	constructor(private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    public managerService: ManagerService,
    public adminService: AdminService) { }

	insertPeriodDatesMeals() {
    this.insertPeriodDatesByType('meals');
	}

	insertPeriodDatesAccommodation() {
    this.insertPeriodDatesByType('accommodation');
	}

  getYearValueOnChange(event: any, mode: string) {
    if (mode === 'meals') {
      this.modelMealsSelectedYear = event;
      console.log(this.modelMealsSelectedYear);
    } else {
      this.modelAccommodationSelectedYear = event;
      console.log(this.modelAccommodationSelectedYear);
    }
  }


  insertPeriodDatesByType(appType: string) {
    const selectedCity: AvailableCities = appType == 'meals' ? this.citySelect?.nativeElement?.value
                                                             : this.citySelectAcc?.nativeElement?.value;

    if (selectedCity) {
      let departments = Utils.getDepartmentsIdsByCity(selectedCity);
      let failure = false;

      for (let department of departments) {
        let departmentId = Number(department);

        const data = appType == 'meals' ? { date_from: this.modelMealsDateFrom, date_to: this.modelMealsDateTo, app_type: appType, acyear: this.modelMealsSelectedYear.split("-")[0] ?? null }
                                        : { date_from: this.modelAccommodationDateFrom, date_to: this.modelAccommodationDateTo, app_type: appType, acyear: this.modelAccommodationSelectedYear.split("-")[0] ?? null };
        this.managerService.insertPeriodDates(data, departmentId).subscribe(responseData => {
          console.log(responseData.message);
          if (responseData.message.includes('error')) {
            failure = true;
          }
        });
      }

      if (failure) {
        Swal.fire({
          title: 'Δημιουργία περιόδου αιτήσεων',
          text: 'Κάτι πήγε στραβά. Δοκιμάστε να κάνετε υποβολή ημερομηνιών ξανά',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        });
        return;
      }

      Swal.fire({
        title: 'Δημιουργία περιόδου αιτήσεων',
        text: 'Οι ημερομηνίες έναρξης και λήξης αιτήσεων δημιουργήθηκαν επιτυχώς',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });

      return;
    }

    // For other departments
    this.adminService.getDepartmentsOfUserByUserID().subscribe((departments: any) => {
      let failure = false;

      for (let department of departments) {
        let departmentId = department.academic_id;

        const data = appType == 'meals' ? { date_from: this.modelMealsDateFrom, date_to: this.modelMealsDateTo, app_type: appType, acyear: this.modelMealsSelectedYear.split("-")[0] ?? null }
                                        : { date_from: this.modelAccommodationDateFrom, date_to: this.modelAccommodationDateTo, app_type: appType, acyear: this.modelAccommodationSelectedYear.split("-")[0] ?? null };
        this.managerService.insertPeriodDates(data, departmentId).subscribe(responseData => {
          console.log(responseData.message);
          if (responseData.message.includes('error')) {
            failure = true;
          }
        });
      }

      if (failure) {
        Swal.fire({
          title: 'Δημιουργία περιόδου αιτήσεων',
          text: 'Κάτι πήγε στραβά. Δοκιμάστε να κάνετε υποβολή ημερομηνιών ξανά',
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        });
        return;
      }

      Swal.fire({
        title: 'Δημιουργία περιόδου αιτήσεων',
        text: 'Οι ημερομηνίες έναρξης και λήξης αιτήσεων δημιουργήθηκαν επιτυχώς',
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ΟΚ'
      });
    });
  }

	ngOnInit(): void {
    this.managerService.getManagerCities()
      .subscribe((cities: any) => {
        let chosenCity = '';

        if (cities.includes(',')) {
          chosenCity = cities.split(',')[0];
          this.isUserNafplio = chosenCity == AvailableCities.NAFPLIO;
        } else {
           chosenCity = cities[0];
        }

        let departments = Utils.getDepartmentsIdsByCity(chosenCity);
        let departmentId = Number(departments[0]);
        console.log(departmentId);

        this.managerService.getPeriodInfo(departmentId)
          .subscribe(results => {
            for (let item of results) {
              if (item.app_type == 'meals') {
                this.modelMealsDateFrom = item.date_from;
                this.modelMealsDateTo = item.date_to;
                this.modelMealsSelectedYear = item.acyear;
              } else {
                this.modelAccommodationDateFrom = item.date_from;
                this.modelAccommodationDateTo = item.date_to;
                this.modelAccommodationSelectedYear = item.acyear;
              }
            }
          });
      });
	}

  changeDatesByCityMeals() {
    const selectedCity: AvailableCities =  this.citySelect?.nativeElement?.value;

    if (!selectedCity) {
      return;
    }

    let departments = Utils.getDepartmentsIdsByCity(selectedCity);
    let departmentId = Number(departments[0]);

    // Reset mocel values before receiving new values from DB
    this.modelMealsDateFrom = '';
    this.modelMealsDateTo = '';
    this.modelMealsSelectedYear = null;

    this.managerService.getPeriodInfo(departmentId)
      .subscribe(results => {
        for (let item of results) {
          if (item.app_type == 'meals') {
            this.modelMealsDateFrom = item.date_from;
            this.modelMealsDateTo = item.date_to;
            this.modelMealsSelectedYear = item.acyear;
          }
        }
      });
  }

  changeDatesByCityAccommodation() {
    const selectedCity: AvailableCities = this.citySelectAcc?.nativeElement?.value;
    if (!selectedCity) {
      return;
    }

    let departments = Utils.getDepartmentsIdsByCity(selectedCity);
    let departmentId = Number(departments[0]);

    // Reset mocel values before receiving new values from DB
    this.modelAccommodationDateFrom = '';
    this.modelAccommodationDateTo = '';
    this.modelAccommodationSelectedYear = null;

    this.managerService.getPeriodInfo(departmentId)
      .subscribe(results => {
        for (let item of results) {
          if (item.app_type !== 'meals') {
            this.modelAccommodationDateFrom = item.date_from;
            this.modelAccommodationDateTo = item.date_to;
            this.modelAccommodationSelectedYear = item.acyear;
          }
        }
      });
  }
}
