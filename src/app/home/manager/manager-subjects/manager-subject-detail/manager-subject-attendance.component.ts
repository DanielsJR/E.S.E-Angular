import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-attendance [areaRole] = "areaRole"></nx-subject-attendance>
  `,
  styles:['']
})
export class ManagerSubjectAttendanceComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
