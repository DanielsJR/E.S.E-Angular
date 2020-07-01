import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `<nx-subject-evaluations [areaRole]= "areaRole"></nx-subject-evaluations>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
    margin-bottom: 64px;
  }
  `]
})
export class TeacherSubjectEvaluationsComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
