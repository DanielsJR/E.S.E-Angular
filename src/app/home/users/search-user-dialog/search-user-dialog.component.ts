import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { SearchUserDialogRefComponent } from './search-user-dialog-ref/search-user-dialog-ref.component';
import { RESULT_CANCELED, RESULT_ACCEPT, RESULT_ERROR, SEARCH_USER } from '../../../app.config';


@Component({
    selector: 'nx-search-user-dialog',
    template: ``,
    styles: []
})
export class SearchUserDialogComponent implements OnInit {

    @Output() userSelected = new EventEmitter<User>();

    @Input() user: User;
    @Input() userRole: string;
    @Input() actionButton: string;

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }


    openDialogSearchUser(): void {
        let data = {
            user: (this.user) ? this.user : null,
            actionButton: this.actionButton,
            userRole: this.userRole,
            type: SEARCH_USER
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '280px';
        //config.height = 'auto';

        let dialogRef = this.dialog.open(SearchUserDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ACCEPT) {
                this.userSelected.emit(dialogRef.componentInstance.user);
                console.log(RESULT_ACCEPT);
            } else if (result === RESULT_ERROR) {
                console.log(RESULT_ERROR);

            }
        });
    }


}
