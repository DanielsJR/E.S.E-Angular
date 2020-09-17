import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { HomeMenuComponent } from './menus/home-menu.component';
import { UsersMenuComponent } from './menus/users-menu.component';
import { CoursesMenuComponent } from './menus/couses-menu.component';
import { QuizMenuComponent } from './menus/quiz-menu.component';
import { SubjectsMenuComponent } from './menus/subjects-menu.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './customReuseStrategy';
import { UserProfileModule } from './user-profile/user-profile.module';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule,
    UserProfileModule,
    
  ],

  declarations: [
    HomeComponent,

    HomeMenuComponent,
    UsersMenuComponent,
    CoursesMenuComponent,
    SubjectsMenuComponent,
    QuizMenuComponent, 
    UserSettingsComponent,

  ],
  
  entryComponents: [

  ],

  providers: [
   // {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
],


})

export class HomeModule { }
