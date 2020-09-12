import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { RESULT_SUCCEED, RESULT_ERROR, RESULT_WARN } from '../../app.config';

@Component({
  selector: 'nx-snackbars-ref',
  templateUrl: './snackbars-ref.component.html',
  styleUrls: ['./snackbars-ref.component.css']
})
export class SnackbarsRefComponent {

  message: string;
  type: string;

  typeSucceed = RESULT_SUCCEED;
  typeError = RESULT_ERROR;
  typeWarn = RESULT_WARN;

  constructor(public snackBarRef: MatSnackBarRef<SnackbarsRefComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.message = data.message;
    this.type = data.type;
    //console.log('***SnackBar*** message: ' + data.message + ' type: ' + data.type);
  }

  close() {
    this.snackBarRef.dismiss();
  }

}
