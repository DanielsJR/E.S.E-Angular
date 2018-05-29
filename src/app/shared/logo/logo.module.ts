import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoComponent } from './logo.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
  ],

  declarations: [
    LogoComponent,

  ],

  exports: [
    LogoComponent,
  ]
})
export class LogoModule { }
