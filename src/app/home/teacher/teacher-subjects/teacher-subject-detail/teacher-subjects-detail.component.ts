import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';



@Component({
  template: `<nx-subject-detail [areaRole]= "areaRole"></nx-subject-detail>`,
  styles:['']
})
export class TeacherSubjectsDetailComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
