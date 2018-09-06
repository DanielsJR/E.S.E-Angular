import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SearchUserDialogRefComponent } from './search-user-dialog-ref/search-user-dialog-ref.component';


@Component({
    selector: 'nx-search-user-dialog',
    template: ``,
    styles: []
})
export class SearchUserDialogComponent implements OnInit {
    @Input()
    uriRole: string;

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }


    openDialogSearchUser(): void {
        let data = {
            //user: this.user,
            uriRole: this.uriRole,
            type: 'searchUser'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '320px';
        config.height = 'auto';

        let dialogRef = this.dialog.open(SearchUserDialogRefComponent, config);
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
