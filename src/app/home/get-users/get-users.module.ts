import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { GetUsersDialogRefComponent } from './get-users-dialog-ref/get-users-dialog-ref.component';
import { DialogService } from '../../services/dialog.service';
import { MatPaginatorIntl } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MatMomentDateModule} from '@angular/material-moment-adapter';
import { CovalentFileModule } from '@covalent/core';
import { ImageUserDialogRefComponent } from './image-user-dialog-ref/image-user-dialog-ref.component';


@NgModule({
  imports: [
    SharedModule,
    MatMomentDateModule,
    CovalentFileModule,
  ],

  declarations: [
    GetUsersComponent,
    GetUsersDialogRefComponent,
    ImageUserDialogRefComponent,
    
  ],

  providers: [
    DialogService,
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },

    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],

  entryComponents: [
    GetUsersDialogRefComponent,
    ImageUserDialogRefComponent,
  ],

  exports: [
    GetUsersComponent
  ]

})
export class GetUsersModule { }
