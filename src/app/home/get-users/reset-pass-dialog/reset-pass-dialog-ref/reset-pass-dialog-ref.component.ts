import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../../../models/user';
import { UserBackendService } from '../../../../services/user-backend.service';
import { SnackbarService } from '../../../../services/snackbar.service';
import { finalize } from 'rxjs/operators';
import { RESULT_SUCCESS, RESULT_ERROR, RESULT_CANCELED } from '../../../../app.config';


@Component({
  templateUrl: './reset-pass-dialog-ref.component.html',
  styleUrls: ['./reset-pass-dialog-ref.component.css']
})
export class ResetPassDialogRefComponent implements OnInit {

  uriRole: any;
  user: User;
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<ResetPassDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer,
    private userBackendService: UserBackendService,
    private snackbarService: SnackbarService) {

    this.user = data.user;
    this.uriRole = this.data.uriRole;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() { }

  resetedPass(): string {
    const n1 = this.user.firstName.substr(0, this.user.firstName.indexOf(' ')) || this.user.firstName;
    const n2 = this.user.lastName.substr(0, this.user.lastName.indexOf(' ')) || this.user.lastName;
    return n1.toLowerCase() + '_' + n2.toLowerCase() + '@ESE1';
  }

  resetPassword(): void {
    this.isLoading = true;
    const resetedPass = this.resetedPass();

    this.userBackendService.resetUserPassword(this.user.username, resetedPass, this.uriRole)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        if (response) {
          this.dialogRef.close();
          setTimeout(() => this.snackbarService.openSnackBar('Contraseña restablecida', RESULT_SUCCESS));
        } else {
          this.dialogRef.close();
          setTimeout(() => this.snackbarService.openSnackBar('Error al restablecer contraseña', RESULT_ERROR));
        };

      });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}