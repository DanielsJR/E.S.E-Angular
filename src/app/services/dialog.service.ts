import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ImageUserDialogRefComponent } from '../home/get-users/image-user-dialog-ref/image-user-dialog-ref.component';
import { ResetPassDialogRefComponent } from '../home/get-users/reset-pass-dialog-ref/reset-pass-dialog-ref.component';
import { SetRolesDialogRefComponent } from '../home/get-users/set-roles-dialog-ref/set-roles-dialog-ref.component';
import { GetUsersDialogRefComponent } from '../home/get-users/get-users-dialog-ref/get-users-dialog-ref.component';


@Injectable()
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openDialogDetail(data: any): MatDialogRef<GetUsersDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';

    return this.dialog.open(GetUsersDialogRefComponent, config);
  }

  openDialogEdit(data: any): MatDialogRef<GetUsersDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    return this.dialog.open(GetUsersDialogRefComponent, config);
  }

  openDialogDelete(data: any): MatDialogRef<GetUsersDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;
   
    return this.dialog.open(GetUsersDialogRefComponent, config);
  }

  openDialogCreate(data: any): MatDialogRef<GetUsersDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    return this.dialog.open(GetUsersDialogRefComponent, config);
  }

  openDialogImage(data: any): MatDialogRef<ImageUserDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.maxWidth = '420px';
    config.maxHeight = '420px';
    config.minWidth = '300px';
    config.minHeight = '300px';

    return this.dialog.open(ImageUserDialogRefComponent, config);
  }

  openDialogResetPass(data: any): MatDialogRef<ResetPassDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.height = 'auto';

    return this.dialog.open(ResetPassDialogRefComponent, config);
  }

  openDialogSetRoles(data: any): MatDialogRef<SetRolesDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.height = 'auto';

    return this.dialog.open(SetRolesDialogRefComponent, config);
  }

}





