import { LogoMiniFabComponent } from './logo-mini-fab/logo-mini-fab.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { LogoRaisedButtonComponent } from './logo-raised-button/logo-raised-button.component';
import { LogoIconButtonComponent } from './logo-icon-button/logo-icon-button.component';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    LogoRaisedButtonComponent,
    LogoIconButtonComponent,
    LogoMiniFabComponent,
  ],

  exports: [
    LogoRaisedButtonComponent,
    LogoIconButtonComponent,
    LogoMiniFabComponent,
  ]
})
export class LogoModule { }
