import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SnackbarsRefComponent } from './snackbars-ref.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';




@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
    ],
    declarations: [
        SnackbarsRefComponent,
    ],
    entryComponents: [
        SnackbarsRefComponent,
    ],

    exports: [
        SnackbarsRefComponent,
    ]
})
export class SnackbarRefModule { }
