import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CardUserDialogRefComponent } from './card-user-dialog-ref/card-user-dialog-ref.component';



@Component({
    selector: 'nx-card-user-dialog',
    template: ``,
    styles: []
})
export class CardUserDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }


    openDialogCardUser(): MatDialogRef<CardUserDialogRefComponent> {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'cardUser'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '320px';

        return this.dialog.open(CardUserDialogRefComponent, config);

    }

}
