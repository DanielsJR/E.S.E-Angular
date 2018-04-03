import { FullScreenModule } from './full-screen/full-screen.module';
import { ThemePickerModule } from './theme-picker/theme-picker.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerDirective } from './directives/scroll.directive';
import { FullscreenDirective } from './directives/fullscreen.directive';
import { LogoModule } from './logo/logo.module';


@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [
    ScrollerDirective,
    FullscreenDirective,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ThemePickerModule,
    FullScreenModule,
    LogoModule,
    MaterialModule,
    ScrollerDirective,
    FullscreenDirective,

  ]
})
export class SharedModule { }
