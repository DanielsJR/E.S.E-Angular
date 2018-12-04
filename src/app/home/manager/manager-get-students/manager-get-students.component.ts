import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';
import { ROLE_MANAGER, URI_STUDENTS } from '../../../app.config';

@Component({
  template: `
  <nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>
  `,
  styles: ['']
})

export class ManagerGetStudentsComponent implements OnInit {

  uriRole = URI_STUDENTS;
  areaRole = ROLE_MANAGER;

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    //this.userStoreService.loadAllStudents();
  }

}