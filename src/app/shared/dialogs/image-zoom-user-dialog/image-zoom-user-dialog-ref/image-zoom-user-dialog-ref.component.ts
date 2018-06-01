import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';

@Component({
  selector: 'nx-image-zoom-user-dialog-ref',
  templateUrl: './image-zoom-user-dialog-ref.component.html',
  styleUrls: ['./image-zoom-user-dialog-ref.component.css']
})
export class ImageZoomUserDialogRefComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<ImageZoomUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.user = data.user;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
   }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close('canceled');
}


}