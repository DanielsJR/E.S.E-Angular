import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { UsersModule } from '../users/users.module';
import { SetPassDialogRefComponent } from './set-pass-dialog/set-pass-dialog-ref/set-pass-dialog-ref.component';
import { SetPassDialogComponent } from './set-pass-dialog/set-pass-dialog.component';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
    imports: [
        SharedModule,
        UsersModule,

    ],

    declarations: [
        UserProfileComponent,
        SetPassDialogComponent,
        SetPassDialogRefComponent,

    ],


    entryComponents: [
        SetPassDialogRefComponent,
    ],

    exports: [
        UserProfileComponent,
    ]

})
export class UserProfileModule { }
