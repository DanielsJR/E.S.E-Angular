import { Component, OnInit} from '@angular/core';
import { ROLE_MANAGER } from '../../../../app.config';


@Component({
  template: `<nx-subject-evaluations [areaRole] = "areaRole"></nx-subject-evaluations>`,
  styles: [`:host  {
    display: block;
    width: 100%;
    margin-bottom: 64px;
  }
  `]
})
export class ManagerSubjectEvaluationsComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit(): void {

  }
}
