import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './home.routing';
import { HomeMenuComponent } from './home-menu.component';
import { UsersMenuComponent } from './users-menu.component';

import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

import { CovalentFileModule } from '@covalent/core';
import { ImageZoomUserDialogModule } from '../shared/dialogs/image-zoom-user-dialog/image-zoom-user-dialog.module';



@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    CovalentFileModule,
    ImageZoomUserDialogModule,  
   
  ],

  declarations: [
    HomeComponent,
    HomeMenuComponent,
    UsersMenuComponent,
    UserSettingsComponent,
    UserProfileComponent,

    ],


})

export class HomeModule { }
