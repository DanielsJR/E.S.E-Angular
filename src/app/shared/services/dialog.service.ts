import { Input, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';


@Injectable()
export class DialogService {

  data: any = [];
  inputDialogRef;
  obj;
  uriRole: string;

  constructor(public dialog: MatDialog) { }

  openDialogDetail(): void {
    // console.log('openenig dialog : detail');
    this.data.uriRole = this.uriRole;
    this.data.type = 'detail';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '300px',
      data: this.data,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog detail was closed');
      // console.log(`openenig dialog : ${result}`);
      if (result === 'edit') {
        this.openDialogEdit();
      } else if (result === 'delete') {
        this.openDialogDelete();
      }
    });
  }

  openDialogCreate(): void {
    // console.log('openenig dialog : create');
    this.data.uriRole = this.uriRole;
    this.data.type = 'create';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '300px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog create was closed');
      //  console.log(`Dialog result: ${result}`);
    });

  }

  openDialogEdit(): void {
    this.data.uriRole = this.uriRole;
    this.data.type = 'edit';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '300px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog edit was closed '+ JSON.stringify(result));
      // console.log('The dialog edit was closed');
      // console.log(`Dialog result: ${result}`);
    });
  }

  openDialogDelete(): void {
    this.data.uriRole = this.uriRole;
    this.data.type = 'delete';
    this.data.obj = this.obj;
     const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '300px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog delete was closed');
      // console.log(`Dialog result: ${result}`);
    });

  }


}
