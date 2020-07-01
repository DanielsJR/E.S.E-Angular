import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `<nx-subject-grades [areaRole]= "areaRole"></nx-subject-grades>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
    margin-bottom: 64px;
  }
  `]
})
export class TeacherSubjectGradesComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
