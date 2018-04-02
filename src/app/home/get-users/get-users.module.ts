
import { NgModule } from '@angular/core';

import { MatPaginatorIntl } from '@angular/material';
import { SharedModule } from '../../shared/shared.module';
import { DialogService } from '../../shared/services/dialog.service';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { GetUsersStoreService } from './get-users-store.service';
import { GetManagersStoreService } from './get-mangers-store.service';
import { GetTeachersStoreService } from './get-teachers-store.service';
import { GetStudentsStoreService } from './get-students-store.service';



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
    GetUsersStoreService,
    GetManagersStoreService,
    GetTeachersStoreService,
    GetStudentsStoreService
  ],

  entryComponents: [
    GetUsersDialogRefComponent,
  ],

  exports:[
    GetUsersComponent
  ]

})
export class GetUsersModule { }
