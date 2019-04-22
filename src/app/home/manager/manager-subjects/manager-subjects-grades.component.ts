import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../app.config';


@Component({
  template: `
  <nx-subject-grades [areaRole] = "areaRole"></nx-subject-grades>
  `,
  styles:['']
})
export class ManagerSubjectsGradesComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
