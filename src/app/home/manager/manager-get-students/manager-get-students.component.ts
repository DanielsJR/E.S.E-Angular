import { Component, OnInit, } from '@angular/core';
import { UserStoreService } from '../../../services/user-store.service';
import { ROLE_MANAGER, URI_STUDENTS } from '../../../app.config';

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

  uriRole = URI_STUDENTS;
  areaRole = ROLE_MANAGER;

  constructor(private userStoreService: UserStoreService) { }

  ngOnInit() {
    //this.userStoreService.loadAllStudents();
  }

}