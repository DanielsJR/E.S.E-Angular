import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SetRolesDialogRefComponent } from './set-roles-dialog-ref/set-roles-dialog-ref.component';
import { SET_ROLES } from '../../../app.config';



@Component({
    selector: 'nx-set-roles-dialog',
    template: ``,
    styles: []
})
export class SetRolesDialogComponent implements OnInit {

    @Input() user: User;
    @Input() uriUsersRole: string;

    //@Output() userEditedRoles = new EventEmitter<User>();
    // plantilla(userEditedRoles)="afterEditRoles($event)"

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openDialogSetRoles(): MatDialogRef<SetRolesDialogRefComponent> {
        let data = {
            user: this.user,
            uriUsersRole: this.uriUsersRole,
            type: SET_ROLES
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';
        config.disableClose = true;

        return this.dialog.open(SetRolesDialogRefComponent, config);

    }


}
