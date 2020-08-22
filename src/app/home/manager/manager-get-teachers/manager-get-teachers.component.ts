import { Component, OnInit, } from '@angular/core';
import { ROLE_MANAGER, URI_TEACHER } from '../../../app.config';

@Component({
  selector: 'nx-manager-teachers',
  template: `<nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`:host  {
    display: block;
    width: 100%;

  }
  `]
})

export class ManagerGetTeachersComponent implements OnInit {

  uriRole = URI_TEACHER;
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit() {

  }

}
