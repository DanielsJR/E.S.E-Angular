import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { AdminGetUsersComponent, MatPaginatorIntlSpa } from './admin-get-users/admin-get-users.component';
import { MatPaginatorIntl } from '@angular/material';
import { AdminGetUsersDialogRefComponent } from './admin-get-users/admin-get-users-dialog-ref/admin-get-users-dialog-ref.component';
import { AdminGetUsersStoreService } from './admin-get-users/admin-get-users-store.service';
import { SharedModule } from '../../shared/shared.module';
import { DialogService } from '../../shared/services/dialog.service';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
  ],

  declarations: [
    AdminHomeComponent,
    AdminGetUsersComponent,
    AdminGetUsersDialogRefComponent,
   ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
    AdminGetUsersStoreService,
  ],

  entryComponents: [
    AdminGetUsersDialogRefComponent,
  ],
})
export class AdminModule { }
