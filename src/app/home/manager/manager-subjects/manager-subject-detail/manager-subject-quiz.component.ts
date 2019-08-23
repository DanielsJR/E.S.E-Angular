import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-quiz [areaRole] = "areaRole"></nx-subject-quiz>
  `,
  styles:['']
})
export class ManagerSubjectQuizComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
