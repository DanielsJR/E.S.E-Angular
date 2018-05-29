import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullScreenComponent } from './full-screen.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],

  declarations: [
    FullScreenComponent
  ],

  exports: [
    FullScreenComponent
  ]
})
export class FullScreenModule { }
