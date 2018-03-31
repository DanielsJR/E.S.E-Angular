import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { LogoComponent } from './logo.component';



@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    LogoComponent,

  ],

  exports: [
    LogoComponent,
  ]
})
export class LogoModule { }
