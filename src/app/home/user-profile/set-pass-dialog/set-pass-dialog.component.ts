import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SetPassDialogRefComponent } from './set-pass-dialog-ref/set-pass-dialog-ref.component';


@Component({
    selector: 'nx-set-pass-dialog',
    template: ``,
    styles: []
})
export class SetPassDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openDialogSetPass(): void {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'setPass'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '450px';
        config.height = 'auto';
        config.disableClose = true;

        let dialogRef = this.dialog.open(SetPassDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'reseted') {
                console.log('reseted!');
            } else if (result === 'error') {
                console.log('error!');
            }
        });
    }

}
