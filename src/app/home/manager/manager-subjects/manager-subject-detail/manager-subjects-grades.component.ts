import { Component, OnInit } from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `<nx-subject-grades [areaRole] = "areaRole"></nx-subject-grades>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class ManagerSubjectsGradesComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
