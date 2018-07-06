import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarsRefComponent } from '../shared/snackbars-ref/snackbars-ref.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {

  constructor(public snackBar: MatSnackBar) { }

  openSnackBar(data: any): MatSnackBarRef<SnackbarsRefComponent> {
    let config = new MatSnackBarConfig();
    config.data = data;
    config.panelClass = "snackBarService";
    config.duration = (data.type ==='error') ? 6000:4000;
    
    return this.snackBar.openFromComponent(SnackbarsRefComponent, config);
  }
}
