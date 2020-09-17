
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { base64ToFile, ImageCroppedEvent, ImageTransform, Dimensions, ImageCropperComponent } from 'ngx-image-cropper';
import { IMAGE_BASE64, IMAGE_CHANGE_EVENT, RESULT_CANCELED, RESULT_SUCCEED } from '../../../../app.config';


@Component({
  selector: 'nx-img-cropper-dialog-ref',
  templateUrl: './img-cropper-dialog-ref.component.html',
  styleUrls: ['./img-cropper-dialog-ref.component.css']
})
export class ImgCropperDialogRefComponent implements OnInit {

  imageChangedEvent: any = '';
  imageBase64: any = '';

  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = true;
  transform: ImageTransform = {};

  imageInputType;

  constructor(
    public dialogRefImgCropper: MatDialogRef<ImgCropperDialogRefComponent>, @Inject(MAT_DIALOG_DATA) public data: any,

  ) {

    this.imageInputType = this.data.type;

    if (this.imageInputType === IMAGE_CHANGE_EVENT) {
      this.imageChangedEvent = this.data.image;

    } else if (this.imageInputType === IMAGE_BASE64) {
      this.imageBase64 = 'data:image/png;base64,' + this.data.image;

    } else {
      console.error('No imageType');
    }



    //console.log('***ImgCropperDialog*** data.image: ' + data.image);

  }

  ngOnInit(): void {

  }

  cancel(): void {
    this.dialogRefImgCropper.close(RESULT_CANCELED);
  }

  crop(): void {
    this.dialogRefImgCropper.close(RESULT_SUCCEED);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

}
