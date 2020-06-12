import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CovalentFileModule } from '@covalent/core/file';
import { SetPassDialogRefComponent } from './user-profile/set-pass-dialog/set-pass-dialog-ref/set-pass-dialog-ref.component';
import { SetPassDialogComponent } from './user-profile/set-pass-dialog/set-pass-dialog.component';
import { HomeMenuComponent } from './menus/home-menu.component';
import { UsersMenuComponent } from './menus/users-menu.component';
import { CoursesMenuComponent } from './menus/couses-menu.component';
import { QuizMenuComponent } from './menus/quiz-menu.component';
import { SubjectsMenuComponent } from './menus/subjects-menu.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './customReuseStrategy';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    CovalentFileModule,
    
  ],

  declarations: [
    HomeComponent,

    HomeMenuComponent,
    UsersMenuComponent,
    CoursesMenuComponent,
    SubjectsMenuComponent,
    QuizMenuComponent, 

    UserSettingsComponent,
    UserProfileComponent,

    SetPassDialogComponent,
    SetPassDialogRefComponent,


  ],
  
  entryComponents: [
    SetPassDialogRefComponent,
  ],

  providers: [
   // {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
],


})

export class HomeModule { }
