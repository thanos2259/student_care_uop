import { Component, Injectable, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ManagerService } from '../manager.service';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';

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
	ngSelect = "";
	ngSelectPhase = "";
	modelMealsDateFrom: string;
	modelMealsDateTo: string;
	modelAccommodationDateFrom: string;
	modelAccommodationDateTo: string;

	constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>, public managerService: ManagerService) { }

	insertPeriodDatesMeals() {
		const depId = 98;
		const data = { date_from: this.modelMealsDateFrom, date_to: this.modelMealsDateTo, app_type: 'meals' };
		this.managerService.insertPeriodDates(data, depId).subscribe(responseData => {
			// console.log(responseData.message);
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

	insertPeriodDatesAccommodation() {
		const depId = 98;
		const data = { date_from: this.modelAccommodationDateFrom, date_to: this.modelAccommodationDateTo, app_type: 'accommodation' };
		this.managerService.insertPeriodDates(data, depId).subscribe(responseData => {
			// console.log(responseData.message);
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
		this.managerService.getPeriodInfo(98).subscribe(results => {
			// console.log(results);
			for (let item of results) {
				if (item.app_type == 'meals') {
					this.modelMealsDateFrom = item.date_from;
					this.modelMealsDateTo = item.date_to;
				} else {
					this.modelAccommodationDateFrom = item.date_from;
					this.modelAccommodationDateTo = item.date_to;
				}
			}
		})
	}

}
