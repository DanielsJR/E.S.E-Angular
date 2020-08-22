import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CrudUserDialogRefComponent } from './crud-user-dialog-ref/crud-user-dialog-ref.component';
import { SnackbarService } from '../../../shared/snackbars-ref/snackbar.service';
import { RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_ERROR, RESULT_SUCCEED, USER_UPDATE_ERROR, USER_UPDATE_SUCCEED, CRUD_TYPE_EDIT, CRUD_TYPE_DETAIL, CRUD_TYPE_DELETE, CRUD_TYPE_CREATE, USER_CREATE_SUCCEED, USER_CREATE_ERROR, USER_DELETE_SUCCEED, USER_DELETE_ERROR } from '../../../app.config';



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


    openDialogDetail(user?: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: CRUD_TYPE_DETAIL,
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

    openDialogCreate(): void {
        let data = {
            user: new User(),
            uriRole: this.uriRole,
            type: CRUD_TYPE_CREATE,
            areaRole: this.areaRole,
            onlyRead: (this.onlyRead != null) ? this.onlyRead : false
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        this.dialog.open(CrudUserDialogRefComponent, config);
        /*
        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {

            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);

            } else if (result === RESULT_ERROR) {
                this.snackbarService.openSnackBar(USER_CREATE_ERROR, RESULT_ERROR);
                console.error(RESULT_ERROR);

            } else if (result === RESULT_SUCCEED) {
                this.snackbarService.openSnackBar(USER_CREATE_SUCCEED, RESULT_SUCCEED);
                console.log(RESULT_SUCCEED);

            } else {
                console.error('NO Result');
            }
        });*/
    }

    openDialogEdit(user?: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: CRUD_TYPE_EDIT,
            areaRole: this.areaRole,
            onlyRead: (this.onlyRead != null) ? this.onlyRead : false
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        this.dialog.open(CrudUserDialogRefComponent, config);
        /*
        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);

            } else if (result === RESULT_ERROR) {
                this.snackbarService.openSnackBar(USER_UPDATE_ERROR, RESULT_ERROR);
                console.error(RESULT_ERROR);

            } else if (result === RESULT_SUCCEED) {
                this.snackbarService.openSnackBar(USER_UPDATE_SUCCEED, RESULT_SUCCEED);
                console.log(RESULT_SUCCEED);

            } else {
                console.error('NO Result');
            }
        });*/
    }

    openDialogDelete(user?: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: CRUD_TYPE_DELETE,
            areaRole: this.areaRole,
            onlyRead: (this.onlyRead != null) ? this.onlyRead : false
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.disableClose = true;

        this.dialog.open(CrudUserDialogRefComponent, config);

     /*   let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');

            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);

            } else if (result === RESULT_ERROR) {
                console.error(RESULT_ERROR);
                this.snackbarService.openSnackBar(USER_DELETE_ERROR, RESULT_ERROR);

            } else if (result === RESULT_SUCCEED) {
                console.log(RESULT_SUCCEED);
                this.snackbarService.openSnackBar(USER_DELETE_SUCCEED, RESULT_ERROR);

            } else {
                console.error('NO Result');
            }
        });*/

    }




}
