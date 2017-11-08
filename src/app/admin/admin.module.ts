import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminCreateUserComponent
  ]
})
export class AdminModule { }
