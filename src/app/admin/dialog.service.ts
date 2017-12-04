import { Input, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


@Injectable()
export class DialogService {

  data: any = [];
  inputDialogRef;
  obj;

  constructor(public dialog: MatDialog) { }

  openDialogDetail(): void {
    this.data.type = 'detail';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '250px',
      data: this.data,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog detail was closed');
      console.log(`Dialog result: ${result}`);
      if (result === 'edit') {
        this.openDialogEdit();
      } else if (result === 'delete') {
        this.openDialogDelete();
      }
    });
  }

  openDialogEdit(): void {
    this.data.type = 'edit';
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '250px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog edit was closed');
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogCreate(): void {
    this.data.type = 'create';
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '250px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog create was closed');
      console.log(`Dialog result: ${result}`);
    });

  }


  openDialogDelete(): void {
    this.data.type = 'delete';
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '250px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog delete was closed');
      console.log(`Dialog result: ${result}`);
    });

  }


}

