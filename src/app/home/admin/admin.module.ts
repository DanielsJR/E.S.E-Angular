import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersModule } from '../get-users/get-users.module';
import { AdminGetManagersComponent } from './admin-get-users/admin-get-managers.component';
import { AdminComponent } from './admin.component';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    GetUsersModule,
    
  ],

  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminGetManagersComponent,
  
   ],

  providers: [

  ],

})
export class AdminModule { }
