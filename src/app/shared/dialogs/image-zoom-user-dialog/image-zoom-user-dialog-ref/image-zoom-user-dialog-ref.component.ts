import { Component, OnInit, Inject } from '@angular/core';
import { Avatar } from '../../../../models/avatar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  template: `<img [src]= " 'data:'+ avatar?.type+';base64,' + avatar?.data | safe: 'resourceUrl' ">`,
  styles: [`img {
    width: 100%;
}`]
})
export class ImageZoomUserDialogRefComponent implements OnInit {

  avatar: Avatar;

  constructor(public dialogRef: MatDialogRef<ImageZoomUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.avatar = data.avatar;
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }


}
