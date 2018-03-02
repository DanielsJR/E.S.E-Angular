import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerDialogRefComponent } from './manager-get-teachers/manager-dialog-ref/manager-dialog-ref.component';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule
  ],
  declarations: [
    ManagerComponent,
    ManagerHomeComponent,
    ManagerGetTeachersComponent,
    ManagerDialogRefComponent
  ]
})
export class ManagerModule { }
