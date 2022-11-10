import { Component, OnInit } from '@angular/core';
import { Manager } from 'src/app/managers/manager.model';
import { ManagerService } from 'src/app/managers/manager.service';

@Component({
  selector: 'app-manuals',
  templateUrl: './manuals.component.html',
  styleUrls: ['./manuals.component.css']
})
export class ManualsComponent implements OnInit {

  length = 0;

  constructor(public managerService: ManagerService) { }


  ngOnInit(): void {
    this.managerService.getManager()
      .subscribe((managers: Manager[]) => {
        this.length = managers.length;
      });
  }
}
