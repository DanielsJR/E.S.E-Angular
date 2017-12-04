
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { AdminGetUsersComponent } from './admin-get-users/admin-get-users.component';

import { UsersDialogRefComponent } from './admin-get-users/dialog/users-dialog-ref.component';
import { DialogService } from './dialog.service';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],

  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminCreateUserComponent,
    AdminGetUsersComponent,
    UsersDialogRefComponent,
  ],

  providers: [
    DialogService,
  ],

  entryComponents: [
    UsersDialogRefComponent,
  ],
})
export class AdminModule { }
