import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { DialogService } from '../../../services/dialog.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SetRolesDialogRefComponent } from './set-roles-dialog-ref/set-roles-dialog-ref.component';



@Component({
    selector: 'nx-set-roles-dialog',
    template: ``,
    styles: []
})
export class SetRolesDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }


    openDialogSetRoles(): void {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'setRoles'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';

        let dialogRef = this.dialog.open(SetRolesDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'set') {
                console.log('set!');
            } else if (result === 'error') {
                console.log('error!');

            }
        });
    }


}
