import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  ngSelect = "";
  ngSelectPhase = "";

  constructor() { }


  ngOnInit(): void {
  }

}
