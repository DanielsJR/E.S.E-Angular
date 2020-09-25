import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RESULT_CANCELED, RESULT_ACCEPT, RESULT_ACTION1, RESULT_ACTION3, RESULT_ACTION2, SIMPLE_DIALOG_CLASSIC, SIMPLE_DIALOG_CARD } from '../../../../app.config';
import { Avatar } from '../../../../models/avatar';

@Component({
  templateUrl: './simple-dialog-ref.component.html',
  styleUrls: ['./simple-dialog-ref.component.css']
})
export class SimpleDialogRefComponent implements OnInit {

  obj: any;
  dialogTitle: any;
  title: any;
  subtitle: any;
  message: any;
  avatar: Avatar;
  icon: any;
  type: any;
  actionButton1: any;
  actionButton2: any;
  actionButton3: any;
  cancelButton: any;

  guiTypeClassic: string = SIMPLE_DIALOG_CLASSIC;
  guiTypeCard: string = SIMPLE_DIALOG_CARD;

  constructor(public dialogRef: MatDialogRef<SimpleDialogRefComponent>, @Inject(MAT_DIALOG_DATA) public data: any,) {

    console.log('***SimpleDialog*** type: ' + data.type);

    this.obj = this.data.obj;
    this.icon = this.data.icon;
    this.dialogTitle = this.data.dialogTitle;
    this.title = this.data.title;
    this.subtitle = this.data.subtitle;
    this.message = this.data.message;
    this.avatar = this.data.avatar;
    this.actionButton1 = this.data.actionButton1;
    this.actionButton2 = this.data.actionButton2;
    this.actionButton3 = this.data.actionButton3;
    this.cancelButton = (this.data.cancelButton) ? this.data.cancelButton : 'Cancelar';
    this.type = this.data.type;

  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  action1(): void {
    this.dialogRef.close(RESULT_ACTION1);
  }

  action2(): void {
    this.dialogRef.close(RESULT_ACTION2);
  }

  action3(): void {
    this.dialogRef.close(RESULT_ACTION3);
  }

  selectedObj(obj: any) {

  }

}
