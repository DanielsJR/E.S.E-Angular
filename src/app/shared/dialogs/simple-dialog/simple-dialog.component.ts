import { Component, Output, Input, EventEmitter } from "@angular/core";
import { User } from "../../../models/user";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SimpleDialogRefComponent } from "./simple-dialog-ref/simple-dialog-ref.component";
import { RESULT_CANCELED, RESULT_ACCEPT, RESULT_ERROR } from "../../../app.config";
import { Avatar } from "../../../models/avatar";


@Component({
    selector: 'nx-simple-dialog',
    template: ``,
    styles: []
})

export class SimpleDialogComponent {

    @Output() objSelected = new EventEmitter<any>();
    @Input() obj: any;
    @Input() title: string;
    @Input() subtitle: string;
    @Input() avatar: Avatar;
    @Input() message: string;
    

    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openSimpleDialog(): void {
        let data = {
            obj: (this.obj) ? this.obj : null,
            title: this.title,
            subtitle: this.subtitle,
            message: this.message,
            avatar: (this.avatar) ? this.avatar : null,
            type: 'simple-dialog'
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = '320px';
        config.height = 'auto';

        let dialogRef = this.dialog.open(SimpleDialogRefComponent, config);
        dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ACCEPT) {
                this.objSelected.emit(dialogRef.componentInstance.obj);
                console.log(RESULT_ACCEPT);
            } else if (result === RESULT_ERROR) {
                console.log(RESULT_ERROR);

            }
        });
    }

}