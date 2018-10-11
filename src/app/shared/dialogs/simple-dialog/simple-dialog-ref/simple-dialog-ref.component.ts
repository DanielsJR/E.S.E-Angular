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
  successButton;
  title;
  subtitle;
  message;
  avatar: Avatar;

  constructor(
    public dialogRef: MatDialogRef<SimpleDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.obj = this.data.obj;
    this.title = this.data.title;
    this.subtitle = this.data.subtitle;
    this.message = this.data.message;
    this.avatar = this.data.avatar;
    console.log('Dialog*** type: ' + data.type);
    //if (data.user !== null) this.user = this.data.user;
    this.successButton = (!data.obj) ? 'Agregar' : 'Eliminar';
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
