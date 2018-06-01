import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CrudUserDialogRefComponent } from './crud-user-dialog-ref/crud-user-dialog-ref.component';




@Component({
    selector: 'nx-crud-user-dialog',
    template: ``,
    styles: []
})
export class CrudUserDialogComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }


    openDialogDetail(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'detail'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'edit') {
                this.openDialogEdit(user);
            } else if (result === 'delete') {
                this.openDialogDelete(user);//user
            }
        });
    }

    openDialogEdit(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'edit'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'error') {
                console.error('ERROR!!!, could not edit');
            } else if (result === 'edited') {
                console.log('edited!');
            }

        });
    }

    openDialogDelete(user: User): void {
        let data = {
            user: (user) ? user : this.user,
            uriRole: this.uriRole,
            type: 'delete'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'error') {
                console.error('ERROR!!!, could not delete');
            } else if (result === 'deleted') {
                console.log('deleted!');
            }
        });
    }

    openDialogCreate(): void {
        let data = {
            user: new User(),
            uriRole: this.uriRole,
            type: 'create'
        };

        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '700px';
        config.disableClose = true;

        let dialogRef = this.dialog.open(CrudUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === 'canceled') {
                console.log('canceled!');
            } else if (result === 'error') {
                console.error('ERROR!!!, could not create');
            } else if (result === 'created') {
                console.log('created!');
            }
        });
    }


}
