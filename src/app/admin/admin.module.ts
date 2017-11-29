
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { AdminService } from './admin.service';
import { AdminGetUsersComponent } from './admin-get-users/admin-get-users.component';


@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminCreateUserComponent,
    AdminGetUsersComponent,
  ],

  providers: [
    AdminService,
  ]
})
export class AdminModule { }
