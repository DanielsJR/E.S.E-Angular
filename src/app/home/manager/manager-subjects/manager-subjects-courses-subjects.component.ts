import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../app.config';


@Component({
  template: `
  <nx-subjects [areaRole] = "areaRole"></nx-subjects>
  `,
  styles:['']
})
export class ManagerSubjectsCoursesSubjectsComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
