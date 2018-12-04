import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';
import { ROLE_ADMIN, URI_MANAGERS } from '../../../app.config';


@Component({
  template: `
  <nx-users [uriRole] ="uriRole" [areaRole] ="areaRole"></nx-users>
  `,
  styles: ['']
})

export class AdminGetManagersComponent implements OnInit {
  
  uriRole = URI_MANAGERS;
  areaRole = ROLE_ADMIN;

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
   // this.userStoreService.loadAllManagers();
  }

}


