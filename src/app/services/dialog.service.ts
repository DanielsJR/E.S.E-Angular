import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CrudUserDialogRefComponent } from '../home/get-users/crud-user-dialog/crud-user-dialog-ref/crud-user-dialog-ref.component';



@Injectable()
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openDialogDetail(data: any): MatDialogRef<CrudUserDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';

    return this.dialog.open(CrudUserDialogRefComponent, config);
  }

  openDialogEdit(data: any): MatDialogRef<CrudUserDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    return this.dialog.open(CrudUserDialogRefComponent, config);
  }

  openDialogDelete(data: any): MatDialogRef<CrudUserDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '500px';
    config.disableClose = true;
   
    return this.dialog.open(CrudUserDialogRefComponent, config);
  }

  openDialogCreate(data: any): MatDialogRef<CrudUserDialogRefComponent> {
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.width = '700px';
    config.disableClose = true;

    return this.dialog.open(CrudUserDialogRefComponent, config);
  }


}





