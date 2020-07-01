import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `<nx-subject-attendance [areaRole]= "areaRole"></nx-subject-attendance>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
    margin-bottom: 64px;
  }
  `]
})
export class TeacherSubjectAttendanceComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
