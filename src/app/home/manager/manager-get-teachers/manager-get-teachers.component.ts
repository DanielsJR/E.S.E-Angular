import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';
import { ROLE_MANAGER, URI_TEACHERS } from '../../../app.config';

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

  uriRole = URI_TEACHERS;
  areaRole = ROLE_MANAGER;

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    //this.userStoreService.loadAllTeachers();
  }

}
