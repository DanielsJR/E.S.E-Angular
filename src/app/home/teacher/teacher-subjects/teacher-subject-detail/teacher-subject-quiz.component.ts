import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-quiz [areaRole] ="areaRole"></nx-subject-quiz>
  `,
  styles:['']
})
export class TeacherSubjectQuizComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
