import { Component, OnInit, Inject, OnDestroy, RootRenderer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA, MatSlideToggleChange } from '@angular/material';
import { URI_MANAGERS, URI_TEACHERS, ROLE_MANAGER, ROLE_TEACHER } from '../../../../app.config';
import { User } from '../../../../models/user';
import { ManagerStoreService } from '../../../../services/manger-store.service';
import { TeacherStoreService } from '../../../../services/teacher-store.service';
import { StudentStoreService } from '../../../../services/student-store.service';
import { PRIVILEGES } from '../../../../models/privileges';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'nx-set-roles-dialog-ref',
  templateUrl: './set-roles-dialog-ref.component.html',
  styleUrls: ['./set-roles-dialog-ref.component.css']
})
export class SetRolesDialogRefComponent implements OnInit, OnDestroy {

  uriRole: any;
  user: User;
  rolesList = PRIVILEGES;
  setRolesForm: FormGroup;
  subscriptionsetRoles: Subscription;

  roles: string[] = [];
  rolesMapping: { [k: string]: string } = { '=0': '', '=1': 'Privilégio', 'other': 'Privilégios' };



  constructor(public dialogRef: MatDialogRef<SetRolesDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerStoreService: ManagerStoreService, private teacherStoreService: TeacherStoreService,
    private studentStoreService: StudentStoreService, private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer) {

    this.user = data.user;
    this.uriRole = data.uriRole;

    //this.roles = this.user.roles;
    if (this.user.roles.includes(ROLE_MANAGER)) this.roles.push(ROLE_MANAGER);
    if (this.user.roles.includes(ROLE_TEACHER)) this.roles.push(ROLE_TEACHER);

    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit(): void {

    this.buildForm();

    if (this.uriRole === URI_MANAGERS) {
      this.subscriptionsetRoles = this.managerStoreService.setRoles$.subscribe(user => {
        this.teacherStoreService.updateUserFromStore(user);
        this.dialogRef.close('set');
      });


    } else if (this.uriRole === URI_TEACHERS) {
      this.subscriptionsetRoles = this.teacherStoreService.setRoles$.subscribe(user => {
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

  buildForm() {
    this.setRolesForm = this.formBuilder.group({
      toggleManager: [(this.user.roles.includes(ROLE_MANAGER)) ? true : false],
      toggleTeacher: [(this.user.roles.includes(ROLE_TEACHER)) ? true : false],
    });
  }

  toggleManager(event: MatSlideToggleChange) {
    (event.checked) ? this.roles.push(ROLE_MANAGER) : this.roles = this.roles.filter(e => e !== (ROLE_MANAGER));
  }

  toggleTeacher(event: MatSlideToggleChange) {
    (event.checked) ? this.roles.push(ROLE_TEACHER) : this.roles = this.roles.filter(e => e !== (ROLE_TEACHER));
  }

  setRoles(): void {
    let rolesOrdained: string[] = [];
    if (this.setRolesForm.get('toggleManager').value) rolesOrdained.push(ROLE_MANAGER);
    if (this.setRolesForm.get('toggleTeacher').value) rolesOrdained.push(ROLE_TEACHER);

   // if (this.setRolesForm.value.toggleManager) rolesOrdained.push(ROLE_MANAGER);
   // if (this.setRolesForm.value.toggleTeacher) rolesOrdained.push(ROLE_TEACHER);

    if (this.roles.length > 0) this.user.roles = rolesOrdained;

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

  
}
