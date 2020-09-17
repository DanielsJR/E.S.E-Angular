import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/internal/operators/finalize';
import { RESULT_ERROR, RESULT_SUCCEED } from '../../../../app.config';
import { User } from '../../../../models/user';
import { UserBackendService } from '../../../../services/user-backend.service';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';


@Component({
  templateUrl: './reset-pass-dialog-ref.component.html',
  styleUrls: ['./reset-pass-dialog-ref.component.css']
})
export class ResetPassDialogRefComponent implements OnInit {

  uriUsersRole: any;
  user: User;
  isLoading = false;

  constructor(public dialogRef: MatDialogRef<ResetPassDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userBackendService: UserBackendService,
    private snackbarService: SnackbarService) {

    this.user = data.user;
    this.uriUsersRole = this.data.uriUsersRole;
    console.log('***DialogResetPass*** userName: ' + data.user.firstName + ' uriUsersRole: ' + data.uriUsersRole + ' type: ' + data.type);
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

    this.userBackendService.resetUserPassword(this.user.username, resetedPass, this.uriUsersRole)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(response => {
        (response) ? setTimeout(() => this.snackbarService.openSnackBar('Contraseña restablecida', RESULT_SUCCEED)) :
          setTimeout(() => this.snackbarService.openSnackBar('Error al restablecer contraseña', RESULT_ERROR));

        this.dialogRef.close();

      }, err => this.snackbarService.openSnackBar(err.error.errors, RESULT_ERROR)
      );

  }

  cancel(): void {
    this.dialogRef.close();
  }
}