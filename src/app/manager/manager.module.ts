import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule
  ],
  declarations: [
    ManagerComponent,
    ManagerHomeComponent
  ]
})
export class ManagerModule { }
