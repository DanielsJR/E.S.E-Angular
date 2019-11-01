import { Component, OnInit } from '@angular/core';
import { ROLE_STUDENT } from '../../../app.config';



@Component({
  template: `
  <nx-subject-detail [areaRole]= "areaRole"></nx-subject-detail>
  `,
  styles:['']
})
export class StudentSubjectsDetailComponent implements OnInit {
  areaRole = ROLE_STUDENT;

  constructor() { }

  ngOnInit(): void {

  }
}
