import { ThemePickerComponent } from './theme-picker.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { ThemeService } from './theme.service';




@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatGridListModule,
  ],

  declarations: [
    ThemePickerComponent
  ],

  exports: [
    ThemePickerComponent
  ],

  providers:[
    ThemeService
  ]
})
export class ThemePickerModule { }
