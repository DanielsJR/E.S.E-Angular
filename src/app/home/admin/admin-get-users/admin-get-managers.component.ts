import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';


@Component({
  template: `
  <nx-get-users [uriRole] ="'/managers'" [areaRole] ="'ADMIN'"></nx-get-users>
  `,
  styles: ['']
})

export class AdminGetManagersComponent implements OnInit {

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
   // this.userStoreService.loadAllManagers();
  }

}


