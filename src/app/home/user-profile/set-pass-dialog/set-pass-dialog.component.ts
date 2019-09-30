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

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }

    openDialogSetPass(): void {
        let data = {
            user: this.user,
            uriRole: 'none',
            type: 'setPass'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '450px';
        config.height = 'auto';
        config.disableClose = true;

       this.dialog.open(SetPassDialogRefComponent, config);

    }

}
