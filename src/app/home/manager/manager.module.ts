
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { NgModule } from '@angular/core';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager.routing';
import { GetUsersModule } from '../get-users/get-users.module';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerComponent } from './manager.component';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule,
    GetUsersModule
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,
    ManagerGetTeachersComponent,
    ManagerGetStudentsComponent
  ],

  providers: [

  ],

})
export class ManagerModule { }
