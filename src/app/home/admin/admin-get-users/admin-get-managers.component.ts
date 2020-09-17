import { Component, OnInit, } from '@angular/core';
import { ROLE_ADMIN, URI_MANAGER } from '../../../app.config';


@Component({
  template: `<nx-users [uriUsersRole] ="uriUsersRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
  }
  `]
})

export class AdminGetManagersComponent implements OnInit {
  
  uriUsersRole = URI_MANAGER;
  areaRole = ROLE_ADMIN;

  constructor() { }

  ngOnInit() {
  }

}


