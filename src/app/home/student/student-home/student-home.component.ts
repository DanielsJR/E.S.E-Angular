import { Component, OnInit } from '@angular/core';
import { ROLE_STUDENT } from '../../../app.config';


@Component({
  selector: 'nx-student-home',
  template: `<nx-home-user [areaRole] ="areaRole"></nx-home-user>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})

export class StudentHomeComponent implements OnInit {
  areaRole = ROLE_STUDENT;
  constructor() { }

  ngOnInit() {
  }

}
