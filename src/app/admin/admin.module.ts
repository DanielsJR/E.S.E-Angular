
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { AdminGetUsersComponent, MatPaginatorIntlSpa } from './admin-get-users/admin-get-users.component';

import { UsersDialogRefComponent } from './admin-get-users/dialog/users-dialog-ref.component';
import { DialogService } from './dialog.service';
import { MatPaginatorIntl } from '@angular/material';
import { AdminGetAdminsComponent } from './admin-get-admins/admin-get-admins.component';
import { AdminGetMangersComponent } from './admin-get-mangers/admin-get-mangers.component';
import { AdminGetTeachersComponent } from './admin-get-teachers/admin-get-teachers.component';
import { AdminGetStudentsComponent } from './admin-get-students/admin-get-students.component';



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
    AdminGetAdminsComponent,
    AdminGetMangersComponent,
    AdminGetTeachersComponent,
    AdminGetStudentsComponent,
  ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
  ],

  entryComponents: [
    UsersDialogRefComponent,
  ],
})
export class AdminModule { }
