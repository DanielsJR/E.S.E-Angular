import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { URI_MANAGERS, URI_TEACHERS, ROLE_MANAGER, ROLE_TEACHER } from '../../../../app.config';
import { User } from '../../../../models/user';
import { PRIVILEGES } from '../../../../models/privileges';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserStoreService } from '../../../../services/user-store.service';


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
  subscriptionIsLoading: Subscription;

  roles: string[] = [];
  rolesMapping: { [k: string]: string } = { '=0': '', '=1': 'Privilégio', 'other': 'Privilégios' };

  isLoading: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<SetRolesDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userStoreService: UserStoreService,
    private formBuilder: FormBuilder,
    public sanitizer: DomSanitizer
  ) {

    this.user = data.user;
    this.uriRole = data.uriRole;

    if (this.user.roles.includes(ROLE_MANAGER)) this.roles.push(ROLE_MANAGER);
    if (this.user.roles.includes(ROLE_TEACHER)) this.roles.push(ROLE_TEACHER);

    console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit(): void {

    this.buildForm();

    this.subscriptionIsLoading = this.userStoreService.isLoadingRoles$.subscribe(isLoadding => this.isLoading = isLoadding);


    if (this.uriRole === URI_MANAGERS) {
      this.subscriptionsetRoles = this.userStoreService.setRoles$.subscribe(user => {
        this.userStoreService.updateTeacherInStore(user);
        this.dialogRef.close('set');
      });


    } else if (this.uriRole === URI_TEACHERS) {
        this.subscriptionsetRoles = this.userStoreService.setRoles$.subscribe(user => {
        this.userStoreService.updateManagerInStore(user);
        this.dialogRef.close('set');
      });

    } else {
      console.error('NO uriRole');
    }

  }

  ngOnDestroy() {
    this.subscriptionsetRoles.unsubscribe();
    this.subscriptionIsLoading.unsubscribe();
  }

  buildForm() {
    this.setRolesForm = this.formBuilder.group({
      slideToggleManager: [(this.user.roles.includes(ROLE_MANAGER)) ? true : false],
      slideToggleTeacher: [(this.user.roles.includes(ROLE_TEACHER)) ? true : false],
    });
  }

  get slideToggleManager() { return this.setRolesForm.get('slideToggleManager') };
  get slideToggleTeacher() { return this.setRolesForm.get('slideToggleTeacher') };

  toggleManager() {
    (this.slideToggleManager.value) ? this.roles.push(ROLE_MANAGER) : this.roles = this.roles.filter(e => e !== (ROLE_MANAGER));
  }

  toggleTeacher() {
    (this.slideToggleTeacher.value) ? this.roles.push(ROLE_TEACHER) : this.roles = this.roles.filter(e => e !== (ROLE_TEACHER));
  }

  setRoles(): void {
    let rolesOrdained: string[] = [];
    if (this.slideToggleManager.value) rolesOrdained.push(ROLE_MANAGER);
    if (this.slideToggleTeacher.value) rolesOrdained.push(ROLE_TEACHER);

    // if (this.setRolesForm.value.slideToggleManager) rolesOrdained.push(ROLE_MANAGER);
    // if (this.setRolesForm.value.slideToggleTeacher) rolesOrdained.push(ROLE_TEACHER);

    if (this.roles.length > 0) this.user.roles = rolesOrdained;

    if (this.uriRole === URI_MANAGERS) {
      this.userStoreService.setManagerRoles(this.user);

    } else if (this.uriRole === URI_TEACHERS) {
      this.userStoreService.setTeacherRoles(this.user);

    } else {
      console.error('NO uriRole');
    }
  }

  cancel(): void {
    this.dialogRef.close('canceled');
  }


}
