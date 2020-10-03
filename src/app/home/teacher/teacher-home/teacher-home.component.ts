import { Component, OnInit } from '@angular/core';
import { ROLE_TEACHER } from '../../../app.config';

@Component({
  selector: 'nx-teacher-home',
  template: `<nx-home-user [areaRole] ="areaRole"></nx-home-user>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class TeacherHomeComponent implements OnInit {
  areaRole = ROLE_TEACHER;

  constructor() { }

  ngOnInit() {
  }

}
