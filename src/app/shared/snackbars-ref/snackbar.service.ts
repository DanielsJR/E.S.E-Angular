import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarsRefComponent } from './snackbars-ref.component';
import { RESULT_ERROR } from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(message: string, type: string): MatSnackBarRef<SnackbarsRefComponent> {
    let config = new MatSnackBarConfig();
    config.data = {
      message: message,
      type: type
    }
    config.panelClass = "snackBarService";
    config.duration = (type === RESULT_ERROR) ? 9000 : 4000;

    return this.snackBar.openFromComponent(SnackbarsRefComponent, config);
  }

  openSnackBarData(data: any): MatSnackBarRef<SnackbarsRefComponent> {
    let config = new MatSnackBarConfig();
    config.data = data;
    config.panelClass = "snackBarService";
    config.duration = (data.type === RESULT_ERROR) ? 9000 : 4000;

    return this.snackBar.openFromComponent(SnackbarsRefComponent, config);
  }


}

