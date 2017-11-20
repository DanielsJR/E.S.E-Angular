import { LogoMiniFabComponent } from './logo-mini-fab/logo-mini-fab.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { LogoRaisedButtonComponent } from './logo-raised-button/logo-raised-button.component';
import { LogoIconButtonComponent } from './logo-icon-button/logo-icon-button.component';
import { LogoFabComponent } from './logo-fab/logo-fab.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    LogoRaisedButtonComponent,
    LogoIconButtonComponent,
    LogoMiniFabComponent,
    LogoFabComponent,
  ],

  exports: [
    LogoRaisedButtonComponent,
    LogoIconButtonComponent,
    LogoMiniFabComponent,
    LogoFabComponent,
  ]
})
export class LogoModule { }
