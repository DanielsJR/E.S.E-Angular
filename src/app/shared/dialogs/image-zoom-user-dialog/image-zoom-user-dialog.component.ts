import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { ImageZoomUserDialogRefComponent } from './image-zoom-user-dialog-ref/image-zoom-user-dialog-ref.component';



@Component({
    selector: 'nx-image-zoom-user',
    template: ``,
    styles: []
})
export class ImageZoomUserDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openDialogImage(): void {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'imageZoom'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.maxWidth = '420px';
        config.maxHeight = '420px';
        config.minWidth = '300px';
        config.minHeight = '300px';

        let dialogRef = this.dialog.open(ImageZoomUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            }
        });
    }

}
