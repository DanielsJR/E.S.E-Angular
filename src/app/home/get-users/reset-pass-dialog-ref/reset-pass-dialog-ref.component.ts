import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { UserBackendService } from '../../../services/user-backend.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'nx-reset-pass-dialog-ref',
  templateUrl: './reset-pass-dialog-ref.component.html',
  styleUrls: ['./reset-pass-dialog-ref.component.css']
})
export class ResetPassDialogRefComponent implements OnInit {

  uriRole: any;
  user: User;

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

  openSnackBar(message: string, type: any): void {
    let data = {
      message: message,
      uriRole: this.uriRole,
      type: type
    };

    let snackBarRef = this.snackbarService.openSnackBar(data);
    snackBarRef.afterOpened().subscribe(() => console.log('The snack-bar afterOpened!!!!'));
    snackBarRef.afterDismissed().subscribe(() => console.log('The snack-bar was dismissed!!!'));
    snackBarRef.onAction().subscribe(() => console.log('The snack-bar action was triggered!!!!'));
  }

  resetPassword(): void {
    const n1 = this.user.firstName.substr(0, this.user.firstName.indexOf(' ')) || this.user.firstName;
    const n2 = this.user.lastName.substr(0, this.user.lastName.indexOf(' ')) || this.user.lastName;
    const resetedPass = n1.toLowerCase() + '_' + n2.toLowerCase() + '@ESE1';

    this.userBackendService
      .resetUserPassword(this.user.id, resetedPass, this.uriRole)
      .subscribe(response => {
        if (response) {
          this.dialogRef.close('reseted');
          setTimeout(() => this.openSnackBar('Contraseña restablecida', 'success'));
        } else {
          this.dialogRef.close('error');
          setTimeout(() => this.openSnackBar('Error al restablecer contraseña', 'Error'));
        };

      });
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
}