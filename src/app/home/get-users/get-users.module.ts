import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { DialogService } from '../../services/dialog.service';
import { MatPaginatorIntl } from '@angular/material';



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
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },
  ],

  entryComponents: [
    GetUsersDialogRefComponent,
  ],

  exports: [
    GetUsersComponent
  ]

})
export class GetUsersModule { }
