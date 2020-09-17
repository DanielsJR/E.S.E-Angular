import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CardUserDialogRefComponent } from './card-user-dialog-ref/card-user-dialog-ref.component';
import { CARD_USER } from '../../../app.config';



@Component({
    selector: 'nx-card-user-dialog',
    template: ``,
    styles: []
})
export class CardUserDialogComponent implements OnInit {

    @Input() user: User;
    @Input() areaRole;
    @Input() onlyRead: boolean;

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }


    openDialogCardUser(): MatDialogRef<CardUserDialogRefComponent> {
        let data = {
            user: this.user,
            type: CARD_USER,
            areaRole: this.areaRole,
            onlyRead: (this.onlyRead != null) ? this.onlyRead : false
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '280px';

        return this.dialog.open(CardUserDialogRefComponent, config);

    }

}
