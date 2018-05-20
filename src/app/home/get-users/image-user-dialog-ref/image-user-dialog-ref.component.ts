import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'nx-image-user-dialog-ref',
  templateUrl: './image-user-dialog-ref.component.html',
  styleUrls: ['./image-user-dialog-ref.component.css']
})
export class ImageUserDialogRefComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<ImageUserDialogRefComponent>,
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
