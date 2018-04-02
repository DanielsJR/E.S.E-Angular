import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { DialogService } from '../../shared/services/dialog.service';
import { GetUsersModule } from '../get-users/get-users.module';
import { AdminGetManagersComponent } from './admin-get-users/admin-get-managers.component';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    GetUsersModule
  ],

  declarations: [
    AdminHomeComponent,
    AdminGetManagersComponent,
  
   ],

  providers: [

  ],

})
export class AdminModule { }
