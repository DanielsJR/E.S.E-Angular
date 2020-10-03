import { Component, OnInit } from '@angular/core';
import { ROLE_ADMIN } from '../../../app.config';

@Component({
  selector: 'nx-admin-home',
  template: `<nx-home-user [areaRole] ="areaRole"></nx-home-user>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class AdminHomeComponent implements OnInit {
  areaRole = ROLE_ADMIN;

  constructor() { }

  ngOnInit() {

  }

}
