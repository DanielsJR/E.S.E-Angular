import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageZoomUserDialogRefComponent } from './image-zoom-user-dialog-ref/image-zoom-user-dialog-ref.component';
import { ImageZoomUserDialogComponent } from './image-zoom-user-dialog.component';
import { MaterialModule } from '../../material.module';
import { PipeModule } from '../../pipes/pipe.module';



@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        PipeModule,
    ],

    declarations: [
        ImageZoomUserDialogComponent,
        ImageZoomUserDialogRefComponent,
    ],

    entryComponents: [
        ImageZoomUserDialogRefComponent,
    ],

    exports: [
        ImageZoomUserDialogComponent,

    ]
})
export class ImageZoomUserDialogModule { }