
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { AdminGetUsersComponent, MatPaginatorIntlSpa } from './admin-get-users/admin-get-users.component';

import { UsersDialogRefComponent } from './admin-get-users/dialog/users-dialog-ref.component';
import { DialogService } from './dialog.service';
import { MatPaginatorIntl } from '@angular/material';
import { UserStoreService } from './admin-get-users/user-store.service';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],

  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminGetUsersComponent,
    UsersDialogRefComponent,
   ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
    UserStoreService
  ],

  entryComponents: [
    UsersDialogRefComponent,
  ],
})
export class AdminModule { }
