import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FullScreenComponent } from './full-screen.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    FullScreenComponent
  ],

  exports: [
    FullScreenComponent
  ]
})
export class FullScreenModule { }
