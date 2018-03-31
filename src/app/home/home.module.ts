import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeRoutingModule } from './home.routing';


@NgModule({
  imports: [
    SharedModule,
    HomeRoutingModule
  ],

  declarations: [
    HomeComponent
  ]
})

export class HomeModule { }
