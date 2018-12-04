import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../app.config';


@Component({
  template: `
  <nx-subjects-courses [areaRole]="areaRole"></nx-subjects-courses>
  `,
  styles:['']
})
export class TeacherSubjectsCoursesComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
