import { Component, Output, Input, EventEmitter } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { SimpleDialogRefComponent } from "./simple-dialog-ref/simple-dialog-ref.component";
import { RESULT_CANCELED, RESULT_ACCEPT, RESULT_ERROR } from "../../../app.config";
import { Avatar } from "../../../models/avatar";


@Component({
    selector: 'nx-simple-dialog',
    template: ``,
    styles: []
})

export class SimpleDialogComponent {

    //@Output() objSelected = new EventEmitter<any>();
    @Input() obj: any;
    @Input() icon: string;
    @Input() dialogTitle: string;
    @Input() title: string;
    @Input() subtitle: string;
    @Input() avatar: Avatar;
    @Input() message: string;
    @Input() actionButton1: string;
    @Input() actionButton2: string;
    @Input() actionButton3: string;
    @Input() cancelButton: string;
    @Input() type: string;


    constructor(public dialog: MatDialog) { }

    ngOnInit() { }

    openSimpleDialog(): MatDialogRef<SimpleDialogRefComponent> {
        let data = {
            obj: (this.obj) ? this.obj : null,
            icon:this.icon,
            dialogTitle: this.dialogTitle,
            title: this.title,
            subtitle: this.subtitle,
            message: this.message,
            avatar: (this.avatar) ? this.avatar : null,
            actionButton1: this.actionButton1,
            actionButton2: this.actionButton2,
            actionButton3: this.actionButton3,
            cancelButton: this.cancelButton,
            type: this.type
        };
        let config = new MatDialogConfig();
        config.data = data;
        config.panelClass = 'dialogService';
        config.width = this.type === 'classic' ? '500px' : '320px';
        config.height = 'auto';

        return this.dialog.open(SimpleDialogRefComponent, config);
    /* let  dialogRef = this.dialog.open(SimpleDialogRefComponent, config);  
     dialogRef.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_ACCEPT) {
                this.objSelected.emit(dialogRef.componentInstance.obj);
                console.log(RESULT_ACCEPT);
            } else if (result === RESULT_ERROR) {
                console.log(RESULT_ERROR);

            }
        });*/
    }
    

}