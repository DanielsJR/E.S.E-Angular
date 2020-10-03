import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeUserComponent } from './home-user.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule,
    ],

    declarations: [
        HomeUserComponent,

    ],

    exports: [
        HomeUserComponent,
    ]

})
export class HomeUserModule { }