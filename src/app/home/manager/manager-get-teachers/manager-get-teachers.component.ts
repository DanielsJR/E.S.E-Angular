import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';

@Component({
  template: `
  <nx-get-users [uriRole] ="'/teachers'" [areaRole] ="'MANAGER'"></nx-get-users>
  `,
  styles: ['']
})

export class ManagerGetTeachersComponent implements OnInit {

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    //this.userStoreService.loadAllTeachers();
  }

}
