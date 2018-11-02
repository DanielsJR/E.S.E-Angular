import { FullScreenModule } from './full-screen/full-screen.module';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerDirective } from './directives/scroll.directive';
import { LogoModule } from './logo/logo.module';
import { ThemePickerModule } from './theme-picker/theme-picker.module';
import { SnackbarRefModule } from './snackbars-ref/snackbars-ref.module';
import { ShortNamePipe } from './pipes/short-name.pipe';
import { RolesToSpanishPipe } from './pipes/roles-to-spanish.pipe';
import { SimpleDialogModule } from './dialogs/simple-dialog/simple-dialog.module';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorIntlSpa } from './paginatorCustom/mat-paginator-intl-spa';
import { ShortNameLastnamePipe } from './pipes/short-name-lastname.pipe';


@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [
    ScrollerDirective,
    ShortNamePipe,
    ShortNameLastnamePipe,
    RolesToSpanishPipe,
  ],

  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpa },
  
  ],


  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ThemePickerModule,
    FullScreenModule,
    LogoModule,
    ScrollerDirective,
    SnackbarRefModule,
    ShortNamePipe,
    ShortNameLastnamePipe,
    RolesToSpanishPipe,
    SimpleDialogModule,
   
  ]
})
export class SharedModule { }
