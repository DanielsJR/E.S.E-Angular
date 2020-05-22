import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../app.config';


@Component({
  selector: 'nx-manager-subjects',
  template: `<nx-subjects [areaRole] = "areaRole"></nx-subjects>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class ManagerSubjectsComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
