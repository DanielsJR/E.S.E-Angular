import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogService } from '../../../services/dialog.service';
import { User } from '../../../models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { UserBackendService } from '../../../services/user-backend.service';

@Component({
  selector: 'nx-reset-pass-dialog-ref',
  templateUrl: './reset-pass-dialog-ref.component.html',
  styleUrls: ['./reset-pass-dialog-ref.component.css']
})
export class ResetPassDialogRefComponent implements OnInit {

  uriRole: any;
  obj: User;

  constructor(public dialogRef: MatDialogRef<ResetPassDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogService: DialogService, public sanitizer: DomSanitizer,
    private userBackendService: UserBackendService) {
    this.obj = data.model;
    this.uriRole = this.data.uriRole;
  }

  ngOnInit() {

  }

  resetPassword(): void {
    const n1 = this.obj.firstName.substr(0, this.obj.firstName.indexOf(' ')) || this.obj.firstName;
    const n2 = this.obj.lastName.substr(0, this.obj.lastName.indexOf(' ')) || this.obj.lastName;
    const resetedPass = n1.toLowerCase() + '_' + n2.toLowerCase() + '@ESE1';

    this.userBackendService.resetUserPassword(this.obj.id, resetedPass, this.uriRole).subscribe(
      response => (response) ? this.dialogRef.close('reseted') : this.dialogRef.close('error'));
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
}