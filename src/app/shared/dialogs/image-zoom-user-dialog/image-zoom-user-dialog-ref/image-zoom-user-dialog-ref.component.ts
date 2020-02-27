import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Avatar } from '../../../../models/avatar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './image-zoom-user-dialog-ref.component.html',
  styleUrls: ['./image-zoom-user-dialog-ref.component.css']
})
export class ImageZoomUserDialogRefComponent implements OnInit {

  avatar: Avatar;

  constructor(public dialogRef: MatDialogRef<ImageZoomUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.avatar = data.avatar;
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }


}
