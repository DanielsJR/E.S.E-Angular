import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { RESULT_CANCELED, RESULT_ACCEPT } from '../../../../app.config';
import { Avatar } from '../../../../models/avatar';

@Component({
  templateUrl: './simple-dialog-ref.component.html',
  styleUrls: ['./simple-dialog-ref.component.css']
})
export class SimpleDialogRefComponent implements OnInit {


  obj: any;
  actionButton ='Aceptar';
  dialogTitle;
  title;
  subtitle;
  message;
  avatar: Avatar;
  icon;
  type;

  constructor(
    public dialogRef: MatDialogRef<SimpleDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.obj = this.data.obj;
    this.icon = this.data.icon;
    this.dialogTitle = this.data.dialogTitle;
    this.title = this.data.title;
    this.subtitle = this.data.subtitle;
    this.message = this.data.message;
    this.avatar = this.data.avatar;
    this.actionButton = this.data.actionButton ? this.data.actionButton : this.actionButton;
    this.type = this.data.type;
    console.log('Dialog*** type: ' + data.type);
    //if (data.user !== null) this.user = this.data.user;
    
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  accept(): void {
    this.dialogRef.close(RESULT_ACCEPT);
  }

  selectedObj(obj: any) {

  }

}
