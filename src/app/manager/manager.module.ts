import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { ManagerGetTeachersComponent, MatPaginatorIntlSpa } from './manager-get-teachers/manager-get-teachers.component';
import { DialogService } from '../shared/services/dialog.service';
import { MatPaginatorIntl } from '@angular/material';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { ManagerGetTeachersDialogRefComponent } from './manager-get-teachers/manager-get-teachers-dialog-ref/manager-get-teachers-dialog-ref.component';
import { ManagerGetStudentsStoreService } from './manager-get-students/manager-get-students-store.service';
import { ManagerGetTeachersStoreService } from './manager-get-teachers/manager-get-teachers-store.service';
import { ManagerGetStudentsDialogRefComponent } from './manager-get-students/manager-get-students-dialog-ref/manager-get-students-dialog-ref.component';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,
    ManagerGetTeachersComponent,
    ManagerGetTeachersDialogRefComponent,
    ManagerGetStudentsComponent,
    ManagerGetStudentsDialogRefComponent
  ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
    ManagerGetTeachersStoreService,
    ManagerGetStudentsStoreService

  ],

  entryComponents: [
    ManagerGetTeachersDialogRefComponent,
    ManagerGetStudentsDialogRefComponent
  ],
})
export class ManagerModule { }
