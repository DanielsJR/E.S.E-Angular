import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';

@Component({
  template: `
  <nx-get-users [uriRole] ="'/students'" [areaRole] ="'MANAGER'"></nx-get-users>
  `,
  styles: ['']
})

export class ManagerGetStudentsComponent implements OnInit {

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    //this.userStoreService.loadAllStudents();
  }

}