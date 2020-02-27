import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SetRolesDialogRefComponent } from './set-roles-dialog-ref/set-roles-dialog-ref.component';



@Component({
    selector: 'nx-set-roles-dialog',
    template: ``,
    styles: []
})
export class SetRolesDialogComponent implements OnInit {

    @Input() user: User;
    @Input() uriRole: string;

    //@Output() userEditedRoles = new EventEmitter<User>();
    // plantilla(userEditedRoles)="afterEditRoles($event)"

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openDialogSetRoles(): MatDialogRef<SetRolesDialogRefComponent> {
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

        return this.dialog.open(SetRolesDialogRefComponent, config);

    }


}
