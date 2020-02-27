import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import {
    URI_TEACHERS, URI_MANAGERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT,
    ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH, RESULT_ERROR, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, DD_MM_YYYY, RESULT_SUCCEED, USER_DELETE_SUCCEED, CRUD_TYPE_CREATE, CRUD_TYPE_EDIT
} from '../../../../app.config';
import * as moment from 'moment';
import { COMMUNNES, Commune } from '../../../../models/communes';
import { GENDERS, Gender } from '../../../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { PRIVILEGES } from '../../../../models/privileges';
import { Subscription } from 'rxjs';
import { noWhitespaceValidator } from '../../../../shared/validators/no-white-space-validator';
import { rutValidator } from '../../../../shared/validators/rut-validator';
import { PHONE_PATTERN, NAME_PATTERN } from '../../../../shared/validators/patterns';
import { Avatar } from '../../../../models/avatar';
import { UserStoreService } from '../../../../services/user-store.service';
import { finalize } from 'rxjs/internal/operators/finalize';

import { SetRolesDialogRefComponent } from '../../set-roles-dialog/set-roles-dialog-ref/set-roles-dialog-ref.component';
import { SnackbarService } from '../../../../services/snackbar.service';
import { UserLoggedService } from '../../../../services/user-logged.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
    templateUrl: './crud-user-dialog-ref.component.html',
    styleUrls: ['./crud-user-dialog-ref.component.css']
})

export class CrudUserDialogRefComponent implements OnInit {
    [x: string]: any;

    createForm: FormGroup;
    editForm: FormGroup;
    user: User;
    uriRole: string;
    usersRole: string;
    communes = COMMUNNES;
    genders = GENDERS;
    rolesList = PRIVILEGES;
    files: File | FileList;
    isAdmin = false;
    userLoggedRoles: String[] = [];
    userHightPrivilege: string;
    oldAvatar: Avatar;

    subscriptionSetRolesSuccess: Subscription;

    isLoading = false;
    onlyRead: boolean;

    constructor(public dialogRefCrudUser: MatDialogRef<CrudUserDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userStoreService: UserStoreService, private userLoggedService: UserLoggedService,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer, private snackbarService: SnackbarService

    ) {
        this.user = Object.assign({}, data.user);
        this.uriRole = data.uriRole;
        this.usersRole = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
        this.userLoggedRoles.push(data.areaRole);
        this.onlyRead = data.onlyRead;//(data.areaRole === ROLE_TEACHER) ? true : data.onlyRead;

        console.log('***DialogUser*** userName: ' + data.user.firstName + ' uriRol: '
            + data.uriRole + ' type: ' + data.type + ' areaRole: ' + data.areaRole + ' onlyRead ' + data.onlyRead + ' userRole ' + this.usersRole);
    }

    ngOnInit(): void {
        if (this.data.type === CRUD_TYPE_CREATE) {
            this.buildCreateForm();
            this.setAvatarCreateDefault();

        } else if (this.data.type === CRUD_TYPE_EDIT) {
            this.buildEditForm();
        }

        this.isAdmin = this.userLoggedService.isAdmin();

    }

    usersRoleToSpanish(usersRole: string): string {
        let role = usersRole.toUpperCase();

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

    buildCreateForm() {
        this.createForm = this.formBuilder.group({
            username: [null],
            password: [null],
            firstName: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [null, [noWhitespaceValidator, rutValidator]],//Validators.pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/)
            birthday: [null],
            gender: [this.genders[0].value],
            avatar: [null],
            mobile: [null, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [null, [Validators.email, noWhitespaceValidator]],
            address: [null, noWhitespaceValidator],
            commune: [null],
        });

    }

    get cFirstName() { return this.createForm.get('firstName'); }
    get cLastName() { return this.createForm.get('lastName'); }
    get cDni() { return this.createForm.get('dni'); }
    get cBirthday() { return this.createForm.get('birthday'); }
    get cGender() { return this.createForm.get('gender'); }
    get cAvatar() { return this.createForm.get('avatar'); }
    get cMobile() { return this.createForm.get('mobile'); }
    get cEmail() { return this.createForm.get('email'); }
    get cCommune() { return this.createForm.get('commune'); }
    get cAddress() { return this.createForm.get('address'); }

    buildEditForm() {
        this.editForm = this.formBuilder.group({
            id: [this.user.id],
            username: [{ value: this.user.username, disabled: true }],
            //username: [this.user.username],
            firstName: [this.user.firstName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [this.user.lastName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [this.user.dni, [noWhitespaceValidator, rutValidator]],
            birthday: [(this.user.birthday != null) ? moment(this.user.birthday, DD_MM_YYYY) : null],
            gender: [this.user.gender],
            avatar: [this.user.avatar],
            mobile: [this.user.mobile, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [this.user.email, [Validators.email, noWhitespaceValidator]],
            address: [this.user.address, noWhitespaceValidator],
            commune: [this.user.commune],
            roles: [this.user.roles]

        });

    }

    get eUsername() { return this.editForm.get('username'); }
    get eFirstName() { return this.editForm.get('firstName'); }
    get eLastName() { return this.editForm.get('lastName'); }
    get eDni() { return this.editForm.get('dni'); }
    get eBirthday() { return this.editForm.get('birthday'); }
    get eGender() { return this.editForm.get('gender'); }
    get eAvatar() { return this.editForm.get('avatar'); }
    get eMobile() { return this.editForm.get('mobile'); }
    get eEmail() { return this.editForm.get('email'); }
    get eAddress() { return this.editForm.get('address'); }
    get eCommune() { return this.editForm.get('commune'); }
    get eRoles() { return this.editForm.get('roles'); }


    setAvatarCreateDefault(): void {
        if (!this.files) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `../assets/images/users/default-${this.cGender.value.toLowerCase()}-${this.usersRole}.png`, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                let reader = new FileReader();
                let file = xhr.response;
                file.name = `default-${this.cGender.value.toLowerCase()}-${this.usersRole}.png`;
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.cAvatar.setValue(new Avatar(
                        file.name,
                        file.type,
                        (reader.result as string).split(',')[1])
                    )
                    console.log('setAvatarCreateDefault: ' + file.name)
                };
            };
            xhr.send()
        }
    }

    selectEventCreate(file: File): void {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.cAvatar.setValue(new Avatar(
                file.name,
                file.type,
                (reader.result as string).split(',')[1])
            )
            console.log('selectEventCreate: ' + file.name)
        };

        this.cAvatar.markAsDirty();
    }

    resetCreateAvatar() {
        this.setAvatarCreateDefault();
        this.cAvatar.markAsPristine();
    }

    setAvatarEditDefault(): void {
        let prevImageName: string = this.eAvatar.value.name;
        console.log('prevImageName: ' + prevImageName);
        if (!this.files && (prevImageName.startsWith('default-'))) {
            let userHightPrivilege = this.user.roles[0].toLowerCase();
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `../assets/images/users/default-${this.eGender.value.toLowerCase()}-${userHightPrivilege}.png`, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                let reader = new FileReader();
                let file = xhr.response;
                file.name = `default-${this.eGender.value.toLowerCase()}-${userHightPrivilege}.png`;
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.eAvatar.setValue(new Avatar(
                        file.name,
                        file.type,
                        (reader.result as string).split(',')[1])
                    )
                    console.log('setAvatarEditDefault: ' + file.name)
                };
            };
            xhr.send()

        }
    }

    setAvatarEditDefaultMenu(): void {
        let imageName: string = this.eAvatar.value.name;
        console.log('imageName: ' + imageName)
        if (!imageName.startsWith('default-')) {
            let userHightPrivilege = this.user.roles[0].toLowerCase();
            let xhr = new XMLHttpRequest();
            xhr.open("GET", `../assets/images/users/default-${this.eGender.value.toLowerCase()}-${userHightPrivilege}.png`, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                let reader = new FileReader();
                let file = xhr.response;
                file.name = `default-${this.eGender.value.toLowerCase()}-${userHightPrivilege}.png`;
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.eAvatar.setValue(new Avatar(
                        file.name,
                        file.type,
                        (reader.result as string).split(',')[1])
                    )
                    console.log('setAvatarEditDefaultMenu: ' + file.name)
                };
            };
            xhr.send()
            this.eAvatar.markAsDirty();
        }
    }

    selectEventEdit(file: File): void {
        this.oldAvatar = Object.assign({}, this.eAvatar.value);

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.eAvatar.setValue(new Avatar(
                file.name,
                file.type,
                (reader.result as string).split(',')[1])
            )
            console.log('selectEventEdit: ' + file.name)
        };

        this.eAvatar.markAsDirty();
    }

    resetEditAvatar() {
        this.eAvatar.setValue(this.oldAvatar);
        this.eAvatar.markAsPristine();
    }

    checkEqualOrGreaterPrivileges(userLoggedRoles: string[], userDbRoles: string[]): boolean {
        return userLoggedRoles.every(role => userDbRoles.includes(role));
    }

    private createAutoUsername(): string {
        const n1 = this.createForm.value.firstName.substr(0, this.createForm.value.firstName.indexOf(' ')) || this.createForm.value.firstName;
        const n2 = this.createForm.value.lastName.substr(0, this.createForm.value.lastName.indexOf(' ')) || this.createForm.value.lastName;
        return n1 + '_' + n2;
    }

    private createAutoPassword(): string {
        return this.createAutoUsername().toLowerCase() + '@ESE1';
    }

    private createBirthday(): string {
        return (this.createForm.value.birthday != null) ? moment(this.createForm.value.birthday).format(DD_MM_YYYY) : null;
    }

    editRolesSubscription(dialogRefSetRoles: MatDialogRef<SetRolesDialogRefComponent>) {
        dialogRefSetRoles.afterClosed().subscribe(result => {
            if (result === RESULT_CANCELED) {
                console.log(RESULT_CANCELED);
            } else if (result === RESULT_SUCCEED) {
                this.user = dialogRefSetRoles.componentInstance.user;
                this.eAvatar.setValue(this.user.avatar);
                if (this.uriRole === URI_MANAGERS) {
                    if (!this.user.roles.includes(ROLE_MANAGER)) this.dialogRefCrudUser.close();
                } else if (this.uriRole === URI_TEACHERS) {
                    if (!this.user.roles.includes(ROLE_TEACHER)) this.dialogRefCrudUser.close();
                } else {
                    console.error('NO uriRole');
                }

            } else if (result === RESULT_ERROR) {

            }
        });


    }


    cancel(): void {
        this.dialogRefCrudUser.close(RESULT_CANCELED);
    }

    detailEdit(): void {
        this.dialogRefCrudUser.close(RESULT_EDIT);
    }

    detailDelete(): void {
        this.dialogRefCrudUser.close(RESULT_DELETE);
    }

    create(): void {
        this.createForm.value.username = this.createAutoUsername();
        this.createForm.value.password = this.createAutoPassword();
        this.createForm.value.birthday = this.createBirthday();

        let userCreate: User = this.createForm.value;

        if (this.uriRole === URI_MANAGERS) {
            this.isLoading = true;
            this.userStoreService.createManager(userCreate)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error creating manager: " + err);
                });


        } else if (this.uriRole === URI_TEACHERS) {
            this.isLoading = true;
            this.userStoreService.createTeacher(userCreate)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error creating teacher: " + err);
                });

        } else if (this.uriRole === URI_STUDENTS) {
            this.isLoading = true;
            this.userStoreService.createStudent(userCreate)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error creating student: " + err);
                });

        } else {
            console.error('NO uriRole');
        }

    }

    save(): void {
        this.editForm.value.username = this.eUsername.value;
        this.editForm.value.birthday = (this.eBirthday.value != null) ? moment(this.eBirthday.value).format(DD_MM_YYYY) : null;

        let userEdit: User = this.editForm.value;

        if (this.uriRole === URI_MANAGERS) {
            this.isLoading = true;
            this.userStoreService.updateManager(userEdit)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error editing manager: " + err);
                });

        } else if (this.uriRole === URI_TEACHERS) {
            this.isLoading = true;
            this.userStoreService.updateTeacher(userEdit)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error editing teacher: " + err);
                });

        } else if (this.uriRole === URI_STUDENTS) {
            this.isLoading = true;
            this.userStoreService.updateStudent(userEdit)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                }, err => {
                    console.error("Error editing student: " + err);
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                });

        } else {
            console.error('NO uriRole');
        }

    }

    delete(): void {
        if (this.uriRole === URI_MANAGERS) {
            this.isLoading = true;
            this.userStoreService.deleteManager(this.user)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                    this.snackbarService.openSnackBar(USER_DELETE_SUCCEED, RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error deleting manager: " + err);
                    this.snackbarService.openSnackBar(err.error.message, RESULT_ERROR);
                });

        } else if (this.uriRole === URI_TEACHERS) {
            this.isLoading = true;
            this.userStoreService.deleteTeacher(this.user)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                    this.snackbarService.openSnackBar(USER_DELETE_SUCCEED, RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error deleting teacher: " + err);
                    this.snackbarService.openSnackBar(err.error.message, RESULT_ERROR);
                });

        } else if (this.uriRole === URI_STUDENTS) {
            this.isLoading = true;
            this.userStoreService.deleteStudent(this.user)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe(_ => {
                    this.dialogRefCrudUser.close(RESULT_SUCCEED);
                    this.snackbarService.openSnackBar(USER_DELETE_SUCCEED, RESULT_SUCCEED);
                }, err => {
                    this.dialogRefCrudUser.close(RESULT_ERROR);
                    console.error("Error deleting student: " + err);
                    this.snackbarService.openSnackBar(err.error.message, RESULT_ERROR);
                });

        } else {
            console.error('NO uriRole');
        }

    }



}

