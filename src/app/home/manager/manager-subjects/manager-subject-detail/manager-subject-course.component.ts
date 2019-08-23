import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-course [areaRole] = "areaRole"></nx-subject-course>
  `,
  styles:['']
})
export class ManagerSubjectCourseComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
