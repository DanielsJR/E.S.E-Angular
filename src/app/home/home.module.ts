import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './home.routing';
import { HomeMenuComponent } from './home-menu.component';
import { UsersMenuComponent } from './users-menu.component';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],

  declarations: [
    HomeComponent,
    HomeMenuComponent,
    UsersMenuComponent
    ]
})

export class HomeModule { }
