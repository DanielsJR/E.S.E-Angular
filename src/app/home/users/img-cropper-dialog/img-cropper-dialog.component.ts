import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IMAGE_BASE64, IMAGE_CHANGE_EVENT, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCEED } from '../../../app.config';
import { ImgCropperDialogRefComponent } from './img-cropper-dialog-ref/img-cropper-dialog-ref.component';

@Component({
  selector: 'nx-img-cropper-dialog',
  template: '',
  styles: []
})
export class ImgCropperDialogComponent implements OnInit {

  //@Input() image: any = '';
  @Output() croppedImage = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openCropperChangeEvent(imageChangeEvent: Event): void {

    let data = {
      image: imageChangeEvent,
      type: IMAGE_CHANGE_EVENT
    };
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.disableClose = true;

    let dialogRef = this.dialog.open(ImgCropperDialogRefComponent, config);

    dialogRef.afterClosed().subscribe(result => {

      if (result === RESULT_CANCELED)
        this.canceled.emit(true);

      if (result === RESULT_SUCCEED)
        this.croppedImage.emit(dialogRef.componentInstance.croppedImage);

      if (result === RESULT_ERROR)
        console.log(RESULT_ERROR);

    });

  }

  openCropperImageBase64(imageBase64: string): void {

    let data = {
      image: imageBase64,
      type: IMAGE_BASE64
    };
    let config = new MatDialogConfig();
    config.data = data;
    config.panelClass = 'dialogService';
    config.disableClose = true;

    let dialogRef = this.dialog.open(ImgCropperDialogRefComponent, config);

    dialogRef.afterClosed().subscribe(result => {

      if (result === RESULT_CANCELED)
        this.canceled.emit(true);

      if (result === RESULT_SUCCEED)
        this.croppedImage.emit(dialogRef.componentInstance.croppedImage);

      if (result === RESULT_ERROR)
        console.log(RESULT_ERROR);

    });

  }

}
