import { Component, OnInit, } from '@angular/core';
import { ROLE_ADMIN, URI_MANAGERS, URI_TEACHERS } from '../../../app.config';


@Component({
  template: `<nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`:host  {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  `]
})

export class AdminGetTeachersComponent implements OnInit {
  
  uriRole = URI_TEACHERS;
  areaRole = ROLE_ADMIN;

  constructor() { }

  ngOnInit() {

  }

}


