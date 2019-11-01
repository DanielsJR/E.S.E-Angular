import { Component, OnInit } from '@angular/core';
import { ROLE_STUDENT } from '../../../app.config';



@Component({
  template: `
  <nx-subject-grades [areaRole]= "areaRole"></nx-subject-grades>
  `,
  styles:['']
})
export class StudentSubjectsGradesComponent implements OnInit {
  areaRole = ROLE_STUDENT;

  constructor() { }

  ngOnInit(): void {

  }
}
