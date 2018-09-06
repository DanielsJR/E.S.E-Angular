import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersComponent, MatPaginatorIntlSpa } from './get-users.component';
import { MatPaginatorIntl } from '@angular/material';

import { CovalentFileModule } from '@covalent/core';

import { ImageZoomUserDialogModule } from '../../shared/dialogs/image-zoom-user-dialog/image-zoom-user-dialog.module';
import { ResetPassDialogRefComponent } from './reset-pass-dialog/reset-pass-dialog-ref/reset-pass-dialog-ref.component';
import { SetRolesDialogRefComponent } from './set-roles-dialog/set-roles-dialog-ref/set-roles-dialog-ref.component';
import { SetRolesDialogComponent } from './set-roles-dialog/set-roles-dialog.component';
import { ResetPassDialogComponent } from './reset-pass-dialog/reset-pass-dialog.component';
import { CardUserDialogRefComponent } from './card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component';
import { CardUserDialogComponent } from './card-user-dialog/card-user-dialog.component';
import { CrudUserDialogRefComponent } from './crud-user-dialog/crud-user-dialog-ref/crud-user-dialog-ref.component';
import { CrudUserDialogComponent } from './crud-user-dialog/crud-user-dialog.component';
import { SearchUserDialogRefComponent } from './search-user-dialog/search-user-dialog-ref/search-user-dialog-ref.component';
import { SearchUserDialogComponent } from './search-user-dialog/search-user-dialog.component';


@NgModule({
  imports: [
    SharedModule,
    CovalentFileModule,
    ImageZoomUserDialogModule,
    
  ],

  declarations: [
    GetUsersComponent,

    CrudUserDialogComponent,
    CrudUserDialogRefComponent,
    
    ResetPassDialogComponent,
    ResetPassDialogRefComponent,
    
    SetRolesDialogComponent,
    SetRolesDialogRefComponent,
    
    CardUserDialogComponent,
    CardUserDialogRefComponent,

    SearchUserDialogComponent,
    SearchUserDialogRefComponent,
    
  ],

  providers: [

    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },
  
  ],

  entryComponents: [
    CrudUserDialogRefComponent,
    ResetPassDialogRefComponent,
    SetRolesDialogRefComponent,
    CardUserDialogRefComponent,
    SearchUserDialogRefComponent,
  ],

  exports: [
    GetUsersComponent,
    SearchUserDialogComponent,

  ]

})
export class GetUsersModule { }
