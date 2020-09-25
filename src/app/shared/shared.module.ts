import { FullScreenModule } from './full-screen/full-screen.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerDirective } from './directives/scroll.directive';
import { LogoModule } from './logo/logo.module';
import { ThemePickerModule } from './theme-picker/theme-picker.module';
import { SnackbarRefModule } from './snackbars-ref/snackbars-ref.module';
import { SimpleDialogModule } from './dialogs/simple-dialog/simple-dialog.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlSpa } from './paginatorCustom/mat-paginator-intl-spa';
import { ImageZoomUserDialogModule } from './dialogs/image-zoom-user-dialog/image-zoom-user-dialog.module';
import { ColorGradeDirective } from './directives/color-grade.directive';
import { PipeModule } from './pipes/pipe.module';
import { CovalentFileModule } from '@covalent/core/file';
import { MultiDatePickerModule } from './multi-date-picker/multi-date-picker.module';



@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [
    ScrollerDirective,
    ColorGradeDirective,

  ],

  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },

  ],


  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CovalentFileModule,
    MaterialModule,
    ThemePickerModule,
    FullScreenModule,
    LogoModule,
    ScrollerDirective,
    SnackbarRefModule,
    SimpleDialogModule,
    ImageZoomUserDialogModule,
    ColorGradeDirective,
    PipeModule,
    MultiDatePickerModule,
  ]
})
export class SharedModule { }
