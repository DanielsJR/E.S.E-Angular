import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SetRolesDialogRefComponent } from './set-roles-dialog-ref/set-roles-dialog-ref.component';
import { SnackbarService } from '../../../services/snackbar.service';


@Component({
    selector: 'nx-set-roles-dialog',
    template: ``,
    styles: []
})
export class SetRolesDialogComponent implements OnInit {

    @Input() user: User;

    @Input() uriRole: string;

    @Output() userEditedRoles = new EventEmitter<User>();

    constructor(public dialog: MatDialog, private snackbarService: SnackbarService) { }

    ngOnInit() { }

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
                this.userEditedRoles.emit(dialogRef.componentInstance.user);
                this.snackbarService.openSnackBar("Role(s) Actualizados", 'success');
                console.log('set!');
            } else if (result === 'error') {
                this.snackbarService.openSnackBar("Error al Actualizar Role(s)", 'error');
                console.log('error!');

            }
        });
    }


}
