import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject } from 'rxjs/Subject';


@Injectable()
export class DialogService {

  data: any = [];
  inputDialogRef;
  obj;
  uriRole: string;

  private closeSubject = <Subject<any>>new Subject();
  public readonly close$ = this.closeSubject.asObservable();
 
  constructor(public dialog: MatDialog) { }


  openDialogDetail(): void {
    // console.log('openenig dialog : detail');
    this.data.uriRole = this.uriRole;
    this.data.type = 'detail';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '730px',
      data: this.data,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.closeSubject.next();
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'edit') {
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
      width: '730px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.closeSubject.next();
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'error') {
        console.error('ERROR!!!, could not create');
      } else if (result === 'created') {
        console.log('created!');
      }
    });

  }

  openDialogEdit(): void {
    this.data.uriRole = this.uriRole;
    this.data.type = 'edit';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '730px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.closeSubject.next();
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'error') {
        console.error('ERROR!!!, could not edit');
      } else if (result === 'edited') {
        console.log('edited!');
      }
      
    });
  }

  openDialogDelete(): void {
    this.data.uriRole = this.uriRole;
    this.data.type = 'delete';
    this.data.obj = this.obj;
    const dialogRef = this.dialog.open(this.inputDialogRef, {
      width: '500px',
      data: this.data,
      disableClose: true,
      panelClass: 'myDialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.closeSubject.next();
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'error') {
        console.error('ERROR!!!, could not delete');
      } else if (result === 'deleted') {
        console.log('deleted!');
      }
    });

  }

}





