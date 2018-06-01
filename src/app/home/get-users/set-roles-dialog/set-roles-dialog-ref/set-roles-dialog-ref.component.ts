import { Component, OnInit, Inject, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggle, MatChip } from '@angular/material';
import { URI_MANAGERS, URI_TEACHERS, ROLE_MANAGER, ROLE_TEACHER, ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH } from '../../../../app.config';
import { User } from '../../../../models/user';
import { ManagerStoreService } from '../../../../services/manger-store.service';
import { TeacherStoreService } from '../../../../services/teacher-store.service';
import { StudentStoreService } from '../../../../services/student-store.service';
import { PRIVILEGES } from '../../../../models/privileges';
import { Subscription } from 'rxjs';


@Component({
  selector: 'nx-set-roles-dialog-ref',
  templateUrl: './set-roles-dialog-ref.component.html',
  styleUrls: ['./set-roles-dialog-ref.component.css']
})
export class SetRolesDialogRefComponent implements OnInit, AfterContentInit, OnDestroy {

  uriRole: any;
  user: User;
  rolesList = PRIVILEGES;

  
  subscriptionsetRoles: Subscription;

  @ViewChild('slideToggleManager') slideToggleManager: MatSlideToggle;
  @ViewChild('slideToggleTeacher') slideToggleTeacher: MatSlideToggle;

  constructor(public dialogRef: MatDialogRef<SetRolesDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerStoreService: ManagerStoreService,
    private teacherStoreService: TeacherStoreService,
    private studentStoreService: StudentStoreService,
    public sanitizer: DomSanitizer) {

    this.user = data.user;
    this.uriRole = this.data.uriRole;

  

    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }


  ngAfterContentInit(): void {
    (this.user.roles.includes(ROLE_MANAGER)) ? this.slideToggleManager.checked = true : false;
    (this.user.roles.includes(ROLE_TEACHER)) ? this.slideToggleTeacher.checked = true : false;
  }

  ngOnInit(): void {

    if (this.uriRole === URI_MANAGERS) {
    this.subscriptionsetRoles =  this.managerStoreService.setRoles$.subscribe(user => {
        this.teacherStoreService.updateUserFromStore(user);
        this.dialogRef.close('set');
      });


    } else if (this.uriRole === URI_TEACHERS) {
      this.subscriptionsetRoles =  this.teacherStoreService.setRoles$.subscribe(user => {
        this.managerStoreService.updateUserFromStore(user);
        this.dialogRef.close('set');

      });

    } else {
      console.error('NO uriRole');
    }

  }

  ngOnDestroy() {
    this.subscriptionsetRoles.unsubscribe();
  }

  setRoles(): void {
    let roles: string[] = [];
    if (this.slideToggleManager.checked) roles.push(ROLE_MANAGER);
    if (this.slideToggleTeacher.checked) roles.push(ROLE_TEACHER);
    if (roles.length > 0) this.user.roles = roles;

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
