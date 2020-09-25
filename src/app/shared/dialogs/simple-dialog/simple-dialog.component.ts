import { Component, Output, Input, EventEmitter } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { SimpleDialogRefComponent } from "./simple-dialog-ref/simple-dialog-ref.component";
import { RESULT_CANCELED, RESULT_ACCEPT, RESULT_ERROR, SIMPLE_DIALOG_CLASSIC } from "../../../app.config";
import { Avatar } from "../../../models/avatar";


@Component({
    selector: 'nx-simple-dialog',
    template: ``,
    styles: []
})

export class SimpleDialogComponent {

    //@Output() objSelected = new EventEmitter<any>();
    @Input() obj: any = null;
    @Input() icon: string = '';
    @Input() dialogTitle: string = '';
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() avatar: Avatar = null;
    @Input() message: string = '';
    @Input() actionButton1: string = '';
    @Input() actionButton2: string = '';
    @Input() actionButton3: string = '';
    @Input() cancelButton: string = '';
    @Input() type: string = '';


    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openSimpleDialog(obj?: any, avatar?: Avatar): MatDialogRef<SimpleDialogRefComponent> {
        let data = {
            obj: (obj) ? obj : this.obj,
            icon: this.icon,
            dialogTitle: this.dialogTitle,
            title: this.title,
            subtitle: this.subtitle,
            message: this.message,
            avatar: (avatar) ? avatar : this.avatar,
            actionButton1: this.actionButton1,
            actionButton2: this.actionButton2,
            actionButton3: this.actionButton3,
            cancelButton: this.cancelButton,
            type: this.type
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = this.type === SIMPLE_DIALOG_CLASSIC ? '500px' : '280px';
        config.height = 'auto';

        return this.dialog.open(SimpleDialogRefComponent, config);

    }

    isOpen(): boolean {
        return this.dialog.openDialogs.length > 0;
    }


}