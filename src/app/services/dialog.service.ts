import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { Subject } from 'rxjs/Subject';


@Injectable()
export class DialogService {

  data: any = [];
  inputDialogRef;
  model;
  uriRole: string;

  private closeSubject = <Subject<any>>new Subject();
  public readonly close$ = this.closeSubject.asObservable();

  constructor(public dialog: MatDialog) { }

  openDialogDetail(ref, config: MatDialogConfig): void {
    config.data.type = 'detail';
    const dialogRef = this.dialog.open(ref, config);

    dialogRef.afterClosed().subscribe(result => {
      this.closeSubject.next();
      if (result === 'canceled') {
        console.log('canceled!');
      } else if (result === 'edit') {
        this.openDialogEdit(ref, config);
      } else if (result === 'delete') {
        this.openDialogDelete(ref, config);
      }
    });
  }

  openDialogEdit(ref, config: MatDialogConfig): void {
    config.data.type = 'edit';
    config.disableClose = true;
    const dialogRef = this.dialog.open(ref, config);

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

  openDialogDelete(ref, config: MatDialogConfig): void {
    config.data.type = 'delete';
    config.disableClose = true;
    config.width = ((Number)(config.width.replace('px', ''))  / 1.4).toString() + 'px';
    const dialogRef = this.dialog.open(ref, config);

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

  openDialogCreate(ref, config: MatDialogConfig): void {
    config.data.type = 'create';
    const dialogRef = this.dialog.open(ref, config);

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

}





