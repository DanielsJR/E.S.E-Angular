import { MaterialModule } from '../material.module';
import { ThemePickerComponent } from './theme-picker.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],

  declarations: [
    ThemePickerComponent
  ],

  exports: [
    ThemePickerComponent
  ]
})
export class ThemePickerModule { }
