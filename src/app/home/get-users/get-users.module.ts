import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { StudentStoreService } from './student-store.service';
import { TeacherStoreService } from './teacher-store.service';
import { ManagerStoreService } from './manger-store.service';
import { DialogService } from '../../services/dialog.service';


@NgModule({
  imports: [
    SharedModule,
  ],

  declarations: [
    GetUsersComponent,
    GetUsersDialogRefComponent,
    
   ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa},
    ManagerStoreService,
    TeacherStoreService,
    StudentStoreService
  ],

  entryComponents: [
    GetUsersDialogRefComponent,
  ],

  exports:[
    GetUsersComponent
  ]

})
export class GetUsersModule { }
