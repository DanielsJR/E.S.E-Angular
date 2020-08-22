import { Component, OnInit, } from '@angular/core';
import { ROLE_MANAGER, URI_STUDENT } from '../../../app.config';

@Component({
  selector: 'nx-manager-students',
  template: `<nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>`,
  styles: [`
    :host  {
    display: block;
    width: 100%;
  }
  `]
})

export class ManagerGetStudentsComponent implements OnInit {

  uriRole = URI_STUDENT;
  areaRole = ROLE_MANAGER;

  constructor() { }

  ngOnInit() {

  }

}