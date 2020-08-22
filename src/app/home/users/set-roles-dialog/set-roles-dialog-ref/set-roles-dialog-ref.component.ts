import { Component, OnInit, Inject } from '@angular/core';
import { URI_MANAGER, URI_TEACHER, ROLE_MANAGER, ROLE_TEACHER, RESULT_ERROR, RESULT_CANCELED, RESULT_SUCCEED } from '../../../../app.config';
import { User } from '../../../../models/user';
import { PRIVILEGES } from '../../../../models/privileges';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserStoreService } from '../../../../services/user-store.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { Avatar } from '../../../../models/avatar';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './set-roles-dialog-ref.component.html',
  styleUrls: ['./set-roles-dialog-ref.component.css']
})
export class SetRolesDialogRefComponent implements OnInit {

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
    private userStoreService: UserStoreService, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService
  ) {

    this.user = Object.assign({},data.user);
    this.uriRole = data.uriRole;

    if (this.user.roles.includes(ROLE_MANAGER)) this.roles.push(ROLE_MANAGER);
    if (this.user.roles.includes(ROLE_TEACHER)) this.roles.push(ROLE_TEACHER);

    console.log('***DialogSetRoles*** userName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.setRolesForm = this.formBuilder.group({
      slideToggleManager: [(this.roles.includes(ROLE_MANAGER)) ? true : false],
      slideToggleTeacher: [(this.roles.includes(ROLE_TEACHER)) ? true : false],
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


  private sortRoles(): string[] {
    let rolesSorted: string[] = [];
    if (this.slideToggleManager.value) rolesSorted.push(ROLE_MANAGER);
    if (this.slideToggleTeacher.value) rolesSorted.push(ROLE_TEACHER);

    if (this.roles.length > 0) this.user.roles = rolesSorted;
    return rolesSorted;

  }

  private setRoles(): void {
    this.sortRoles();
    if (this.uriRole === URI_MANAGER) {
      this.isLoading = true;
      this.userStoreService.setManagerRoles(this.user)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(user => {
          this.user = user;
          this.dialogRef.close(RESULT_SUCCEED);
          this.snackbarService.openSnackBar("Roles Actualizados", RESULT_SUCCEED);
        }, err => {
          console.error("Error editing roles manager: " + err.message);
          this.dialogRef.close(RESULT_ERROR);
          this.snackbarService.openSnackBar(err.error.message, RESULT_ERROR);
        });

    } else if (this.uriRole === URI_TEACHER) {
      this.isLoading = true;
      this.userStoreService.setTeacherRoles(this.user)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(user => {
          this.user = user;
          this.dialogRef.close(RESULT_SUCCEED);
          this.snackbarService.openSnackBar("Roles Actualizados", RESULT_SUCCEED);
        }, err => {
          console.error("Error editing roles teacher: " + err.message);
          this.dialogRef.close(RESULT_ERROR);
          this.snackbarService.openSnackBar(err.error.message, RESULT_ERROR);
        });

    } else {
      console.error('NO uriRole');
    }

  }

  setUserRoles() {
    let prevAvatarName: string = this.user.avatar.name;
    console.log('setAvatarDefault*****prevAvatarName: ' + prevAvatarName);
    if (prevAvatarName.startsWith('default-')) {
      let userHightPrivilege = this.sortRoles()[0].toLowerCase();

      let xhr = new XMLHttpRequest();
      xhr.open("GET", `../assets/images/users/default-${this.user.gender.toLowerCase()}-${userHightPrivilege}.png`, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        let reader = new FileReader();
        let file = xhr.response;
        file.name = `default-${this.user.gender.toLowerCase()}-${userHightPrivilege}.png`;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.user.avatar = new Avatar(
            file.name,
            file.type,
            (reader.result as string).split(',')[1]
          )
          console.log('setAvatarDefault*********: ' + file.name)
          this.setRoles();
        };
      };

      xhr.send();

    } else {
      this.setRoles();
    }
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }


}
