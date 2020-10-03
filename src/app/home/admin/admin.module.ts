import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminGetManagersComponent } from './admin-get-users/admin-get-managers.component';
import { AdminComponent } from './admin.component';
import { UsersModule } from '../users/users.module';
import { AdminGetTeachersComponent } from './admin-get-users/admin-get-teachers.component';
import { HomeUserModule } from '../home-user/home-user.module';



@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule,
    UsersModule,
    HomeUserModule,
    
  ],

  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminGetManagersComponent,
    AdminGetTeachersComponent,
  
   ],

  providers: [

  ],

})
export class AdminModule { }
