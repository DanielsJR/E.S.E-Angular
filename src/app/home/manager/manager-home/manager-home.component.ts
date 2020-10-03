import { Component, OnInit } from '@angular/core';
import { ROLE_MANAGER } from '../../../app.config';

@Component({
  selector: 'nx-manager-home',
  template: `<nx-home-user [areaRole] ="areaRole"></nx-home-user>`,
  styles: [`:host  {
    display: block;
    width: 100%;
  }
  `]
})
export class ManagerHomeComponent implements OnInit {
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit() {
  }

}
