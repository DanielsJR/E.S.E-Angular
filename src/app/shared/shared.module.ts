import { FullScreenModule } from './full-screen/full-screen.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerDirective } from './directives/scroll.directive';
import { LogoModule } from './logo/logo.module';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';
import { ThemePickerModule } from './theme-picker/theme-picker.module';
import { SnackbarsRefComponent } from './snackbars-ref/snackbars-ref.component';
import { SnackbarRefModule } from './snackbars-ref/snackbars-ref.module';
import { ImageZoomUserDialogModule } from './dialogs/image-zoom-user-dialog/image-zoom-user-dialog.module';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { RolesToSpanishPipe } from './pipes/roles-to-spanish.pipe';


@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [
    ScrollerDirective,
    ShortNamePipe,
    RolesToSpanishPipe,
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
    SnackbarRefModule,
    ShortNamePipe,
    RolesToSpanishPipe,

  ]
})
export class SharedModule { }
