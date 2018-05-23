import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER, ROLE_MANAGER_SPANISH, ROLE_TEACHER, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH } from '../../../app.config';

@Component({
  selector: 'nx-card-user-dialog-ref',
  templateUrl: './card-user-dialog-ref.component.html',
  styleUrls: ['./card-user-dialog-ref.component.css']
})
export class CardUserDialogRefComponent implements OnInit {

  user: User;

  constructor(public dialogRef: MatDialogRef<CardUserDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer
  ) {
    this.user = data.user;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }
  detail(): void {
    this.dialogRef.close('detail');
  }

  edit(): void {
    this.dialogRef.close('edit');
  }

  delete(): void {
    this.dialogRef.close('delete');
  }

  rolesToSpanish(roles: string[]): string {
    let rolesSpanish: string[] = [];
    for (let role of roles) {
        if (role === ROLE_ADMIN) {
            role = ROLE_ADMIN_SPANISH;
        }
        if (role === ROLE_MANAGER) {
            role = ROLE_MANAGER_SPANISH;
        }
        if (role === ROLE_TEACHER) {
            role = ROLE_TEACHER_SPANISH;
        }
        if (role === ROLE_STUDENT) {
            role = ROLE_STUDENT_SPANISH;
        };
        rolesSpanish.push(role);
    }
    return rolesSpanish.toString().replace(/,/g, ', ');
}


}

