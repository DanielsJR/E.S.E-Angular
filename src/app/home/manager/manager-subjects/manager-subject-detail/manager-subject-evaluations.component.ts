import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-evaluations [areaRole] = "areaRole"></nx-subject-evaluations>
  `,
  styles: [`:host  {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  `]
})
export class ManagerSubjectEvaluationsComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
