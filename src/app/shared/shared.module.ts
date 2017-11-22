import { LogoModule } from './logo.module';
import { ThemePickerModule } from './theme-picker/theme-picker.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerDirective } from './directives/scroll.directive';


@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [
    ScrollerDirective

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemePickerModule,
    LogoModule,
    MaterialModule,
    ScrollerDirective,

  ]
})
export class SharedModule { }
