import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../../app.config';


@Component({
  template: `<nx-subject-course [areaRole] ="areaRole"></nx-subject-course>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
  }
  `]
})
export class TeacherSubjectCourseComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit(): void {

  }
}
