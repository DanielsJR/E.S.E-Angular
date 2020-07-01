import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `<nx-subject-course [areaRole] = "areaRole"></nx-subject-course>`,
  styles: [`:host  {
    display: block;
    width: 100%;
    margin-bottom: 64px;
  }
  `]
})
export class ManagerSubjectCourseComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
