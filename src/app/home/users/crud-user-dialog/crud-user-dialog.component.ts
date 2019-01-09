import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CrudUserDialogRefComponent } from './crud-user-dialog-ref/crud-user-dialog-ref.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_ERROR, RESULT_SUCCESS } from '../../../app.config';


@Component({
    selector: 'nx-crud-user-dialog',
    template: ``,
    styles: []
})
export class CrudUserDialogComponent implements OnInit {

    @Input() user: User;
    @Input() uriRole: string;
    @Input() areaRole: string;
    @Input() onlyRead: boolean;

    constructor(private dialog: MatDialog, private snackbarService: SnackbarService) { }

    ngOnInit() { }

    openDialogDetail(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'detail',
            areaRole: this.areaRole,
            onlyRead: (this.onlyRead != null) ? this.onlyRead : false

        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_EDIT) {
                this.openDialogEdit(user);
            } else if (result === RESULT_DELETE) {
                this.openDialogDelete(user);
            }
        });
    }

    openDialogEdit(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'edit',
            areaRole: this.areaRole
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ERROR) {
                this.snackbarService.openSnackBar("Error al Actualizar Usuario", RESULT_ERROR);
                console.error(RESULT_ERROR);
            } else if (result === RESULT_SUCCESS) {
                this.snackbarService.openSnackBar("Usuario Actualizado", RESULT_SUCCESS);
                console.log(RESULT_SUCCESS);
            }
        });
    }

    openDialogDelete(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'delete',
            areaRole: this.areaRole
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ERROR) {
                this.snackbarService.openSnackBar("Error al Eliminar Usuario", RESULT_ERROR);
                console.error(RESULT_ERROR);
            } else if (result === RESULT_SUCCESS) {
                this.snackbarService.openSnackBar("Usuario Eliminado", RESULT_SUCCESS);
                console.log(RESULT_SUCCESS);
            }
        });
    }

    openDialogCreate(): void {
        let data = {
            user: new User(),
            uriRole: this.uriRole,
            type: 'create',
            areaRole: this.areaRole
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ERROR) {
                this.snackbarService.openSnackBar("Error al Crear Usuario", RESULT_ERROR);
                console.error(RESULT_ERROR);
            } else if (result === RESULT_SUCCESS) {
                this.snackbarService.openSnackBar("Usuario Creado", RESULT_SUCCESS);
                console.log(RESULT_SUCCESS);
            }
        });
    }


}
