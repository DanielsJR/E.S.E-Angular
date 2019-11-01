import { Component, OnInit } from '@angular/core';
import { ROLE_STUDENT } from '../../../app.config';



@Component({
  template: `
  <nx-subject-course [areaRole]= "areaRole"></nx-subject-course>
  `,
  styles:['']
})
export class StudentSubjectCourseComponent implements OnInit {
  areaRole = ROLE_STUDENT;

  constructor() { }

  ngOnInit(): void {

  }
}
