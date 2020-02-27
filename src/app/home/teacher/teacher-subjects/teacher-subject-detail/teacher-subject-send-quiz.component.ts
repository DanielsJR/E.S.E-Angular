import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `
  <nx-subject-send-quiz [areaRole] ="areaRole"></nx-subject-send-quiz>
  `,
  styles:['']
})
export class TeacherSubjectSendQuizComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
