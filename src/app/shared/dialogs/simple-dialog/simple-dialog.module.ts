import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../../material.module";
import { SimpleDialogRefComponent } from "./simple-dialog-ref/simple-dialog-ref.component";
import { SimpleDialogComponent } from "./simple-dialog.component";
import { ImageZoomUserDialogModule } from "../image-zoom-user-dialog/image-zoom-user-dialog.module";



@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        ImageZoomUserDialogModule
    ],

    declarations: [
        SimpleDialogComponent,
        SimpleDialogRefComponent,
    ],

    entryComponents: [
        SimpleDialogRefComponent,
    ],

    exports: [
        SimpleDialogComponent,
        SimpleDialogRefComponent,
    ]
})
export class SimpleDialogModule { }