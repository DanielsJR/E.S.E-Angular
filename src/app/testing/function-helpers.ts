import { MatDialogRef } from "@angular/material";
import { CardUserDialogRefComponent } from "../home/users/card-user-dialog/card-user-dialog-ref/card-user-dialog-ref.component";
import { ROLE_TEACHER, ROLE_STUDENT } from "../app.config";
import { CardUserDialogComponent } from "../home/users/card-user-dialog/card-user-dialog.component";
import { SimpleDialogRefComponent } from "../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component";
import { SimpleDialogComponent } from "../shared/dialogs/simple-dialog/simple-dialog.component";
import { By } from "@angular/platform-browser";

export function getCardUserDialogRef(fixture, userRole: string): MatDialogRef<CardUserDialogRefComponent> {
    let dialogDebugElements = fixture.debugElement.queryAll(By.css('nx-card-user-dialog'));
   
    if (userRole === ROLE_TEACHER) {
        let dialog: CardUserDialogComponent = dialogDebugElements[0].componentInstance;
        let dialogRef: MatDialogRef<CardUserDialogRefComponent> = dialog.openDialogCardUser();
        return dialogRef;
    } else if (userRole === ROLE_STUDENT) {
        let dialog: CardUserDialogComponent = dialogDebugElements[1].componentInstance;
        let dialogRef: MatDialogRef<CardUserDialogRefComponent> = dialog.openDialogCardUser();
        return dialogRef;
    }

}

export function getSimpleDialogRef(fixture): MatDialogRef<SimpleDialogRefComponent> {
    let simpleDialogDebugElements = fixture.debugElement.queryAll(By.css('nx-simple-dialog'));
    let simpleDialog: SimpleDialogComponent = simpleDialogDebugElements[0].componentInstance;
    let simpleDialogRef: MatDialogRef<SimpleDialogRefComponent> = simpleDialog.openSimpleDialog();
    return simpleDialogRef;
}