import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { User } from '../../models/user';


@Component({
    selector: 'nx-set-roles',
    template: ``,
    styles: []
})
export class SetRolesComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;

    constructor(private dialogService: DialogService) { }

    ngOnInit() {
    }

    openDialogSetRoles(): void {
        let data = {
            user: this.user,
            uriRole: this.uriRole,
            type: 'setRoles'
        };

        let dialogRef = this.dialogService.openDialogSetRoles(data);
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
