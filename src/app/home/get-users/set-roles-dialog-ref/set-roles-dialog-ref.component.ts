import { Component, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { ManagerStoreService } from '../../../services/manger-store.service';
import { TeacherStoreService } from '../../../services/teacher-store.service';
import { StudentStoreService } from '../../../services/student-store.service';
import { URI_MANAGERS, URI_TEACHERS, ROLE_MANAGER, ROLE_TEACHER, ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH } from '../../../app.config';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'nx-set-roles-dialog-ref',
  templateUrl: './set-roles-dialog-ref.component.html',
  styleUrls: ['./set-roles-dialog-ref.component.css']
})
export class SetRolesDialogRefComponent implements OnInit {

  uriRole: any;
  user: User;

  constructor(public dialogRef: MatDialogRef<SetRolesDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerStoreService: ManagerStoreService,
    private teacherStoreService: TeacherStoreService,
    private studentStoreService: StudentStoreService,
    public sanitizer: DomSanitizer, private snackbarService: SnackbarService) {

    this.user = data.user;
    this.uriRole = this.data.uriRole;
    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }


  ngOnInit(): void {
    if (this.uriRole === URI_MANAGERS) {
      this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
      this.managerStoreService.setRoles$.subscribe(user => {
        this.teacherStoreService.updateUserFromStore(user);
        this.dialogRef.close('set');
        setTimeout(() => this.openSnackBar('Privilegios Asignados', 'success'));
      });


    } else if (this.uriRole === URI_TEACHERS) {
      this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
      this.teacherStoreService.setRoles$.subscribe(user => {
        this.managerStoreService.updateUserFromStore(user);
        this.dialogRef.close('set');
        setTimeout(() => this.openSnackBar('Privilegios Asignados', 'success'));
      });
    } else {
      console.error('NO uriRole');
    }

  }

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


  setRoles(): void {

    if (this.uriRole === URI_MANAGERS) {
      this.managerStoreService.setRoles(this.user);


    } else if (this.uriRole === URI_TEACHERS) {
      this.teacherStoreService.setRoles(this.user);

    } else {
      console.error('NO uriRole');
    }
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }

  privilegeToSpanish(privilege: string): string {
    let role = privilege.toUpperCase();

    if (role === ROLE_ADMIN) {
      return role = ROLE_ADMIN_SPANISH;
    }
    else if (role === ROLE_MANAGER) {
      return role = ROLE_MANAGER_SPANISH;
    }
    else if (role === ROLE_TEACHER) {
      return role = ROLE_TEACHER_SPANISH;
    }
    else if (role === ROLE_STUDENT) {
      return role = ROLE_STUDENT_SPANISH;
    }
    console.error('no privilege');
    return 'no privilege';
  }



}
