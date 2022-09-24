import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  applicationNumber: number;
  application: string;
  date: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { application: 'Στέγαση', applicationNumber: 2259, date: '28/02/2022', actions: '' },
  { application: 'Σίτιση', applicationNumber: 666, date: '24/09/2022', actions: '' },
];


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})


export class ApplicationsComponent implements OnInit {
  displayedColumns: string[] = ['application', 'applicationNumber', 'date', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {

  }

}


