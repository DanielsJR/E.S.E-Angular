import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InfoDialogComponent } from './month-picker/info-dialog/info-dialog.component';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { MultiDatePickerComponent } from './multi-date-picker.component';
import { RegularDatePickerComponent } from './regular-date-picker/regular-date-picker.component';
import { YearPickerComponent } from './year-picker/year-picker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMomentDateModule,

  ],

  declarations: [
    InfoDialogComponent,
    MultiDatePickerComponent,
    MonthPickerComponent,
    YearPickerComponent,
    RegularDatePickerComponent,
  ],

  entryComponents: [InfoDialogComponent],

  exports: [
    MultiDatePickerComponent,
  ],
  
})
export class MultiDatePickerModule { }