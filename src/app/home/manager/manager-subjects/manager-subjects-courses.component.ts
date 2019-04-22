import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../app.config';


@Component({
  template: `
  <nx-subjects-courses [areaRole] = "areaRole"></nx-subjects-courses>
  `,
  styles:['']
})
export class ManagerSubjectsCoursesComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
