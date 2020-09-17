import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { ImageZoomUserDialogRefComponent } from './image-zoom-user-dialog-ref/image-zoom-user-dialog-ref.component';
import { Avatar } from '../../../models/avatar';
import { IMAGE_ZOOM } from '../../../app.config';



@Component({
    selector: 'nx-image-zoom-user',
    template: ``,
    styles: []
})

export class ImageZoomUserDialogComponent implements OnInit {

    @Input()
    avatar: Avatar;

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openDialogImage(): void {
        let data = {
            avatar: this.avatar,
            type: IMAGE_ZOOM
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '320px';
        config.height = '320px';

        this.dialog.open(ImageZoomUserDialogRefComponent, config);

    }

}
