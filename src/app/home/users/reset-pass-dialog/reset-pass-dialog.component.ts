import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ResetPassDialogRefComponent } from './reset-pass-dialog-ref/reset-pass-dialog-ref.component';


@Component({
    selector: 'nx-reset-pass-dialog',
    template: ``,
    styles: []
})
export class ResetPassDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openDialogResetPass(): void {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'resetPass'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';

        this.dialog.open(ResetPassDialogRefComponent, config);

    }

}
