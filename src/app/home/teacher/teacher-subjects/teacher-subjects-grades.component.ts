import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../app.config';


@Component({
  template: `
  <nx-subject-grades [areaRole]="areaRole"></nx-subject-grades>
  `,
  styles:['']
})
export class TeacherSubjectsGradesComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
