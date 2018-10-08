import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { RESULT_ACCEPT, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, URI_MANAGERS, ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER, ROLE_MANAGER_SPANISH, ROLE_TEACHER, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH, URI_TEACHERS } from '../../../app.config';
import { User } from '../../../models/user';
import { COMMUNNES } from '../../../models/communes';
import { GENDERS } from '../../../models/genders';
import { PRIVILEGES } from '../../../models/privileges';
import { Avatar } from '../../../models/avatar';
import { UserStoreService } from '../../../services/user-store.service';
import { LoginService } from '../../../login/login.service';
import { NAME_PATTERN, PHONE_PATTERN } from '../../validators/patterns';
import { noWhitespaceValidator } from '../../validators/no-white-space-validator';
import { rutValidator } from '../../validators/rut-validator';



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
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
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

    constructor(public dialogRef: MatDialogRef<CrudUserDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer,
        private loginService: LoginService
    ) {
        this.user = data.user;
        this.uriRole = data.uriRole;
        this.usersRole = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
        this.userLoggedRoles.push(data.areaRole);
        console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type + ' areaRole: ' + data.areaRole);
    }

    ngOnInit(): void {
        this.buildForm();
        if (this.data.type === 'create') this.setAvatarCreateDefault();
        this.isAdmin = this.loginService.isAdmin();
    }

    convertDate(birthDay: any) {
        return (this.user.birthday != null) ? birthDay = moment(this.user.birthday, 'DD/MM/YYYY') : null;
    }

    compareByViewValue(a1: any, a2: any) {
        // console.log('a1: ' + a1 + '    '+'a2: ' + a2);
        return a1 && a2 && a1 === a2;
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



    buildForm() {

        this.createForm = this.formBuilder.group({
            username: [],
            password: [],
            firstName: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [null, [noWhitespaceValidator, rutValidator]],//Validators.pattern(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/)
            birthday: [],
            gender: [this.genders[0].value],
            avatar: [],
            mobile: [null, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [null, [Validators.email, noWhitespaceValidator]],
            address: [null, noWhitespaceValidator],
            commune: [],
        });


        this.editForm = this.formBuilder.group({
            id: [this.user.id],
            username: [{ value: this.user.username, disabled: true }],
            //password: [],
            firstName: [this.user.firstName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [this.user.lastName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [this.user.dni, [noWhitespaceValidator, rutValidator]],
            birthday: [(this.user.birthday != null) ? moment(this.user.birthday, 'DD/MM/YYYY') : null],
            gender: [this.user.gender],
            avatar: [this.user.avatar],
            mobile: [this.user.mobile, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [this.user.email, [Validators.email, noWhitespaceValidator]],
            address: [this.user.address, noWhitespaceValidator],
            commune: [this.user.commune],
            roles: [this.user.roles]

        });


    }

    // getters create
    get cFirstName() { return this.createForm.get('firstName'); }
    get cLastName() { return this.createForm.get('lastName'); }
    get cDni() { return this.createForm.get('dni'); }
    get cBirthday() { return this.createForm.get('birthday'); }
    get cGender() { return this.createForm.get('gender'); }
    get cAvatar() { return this.createForm.get('avatar'); }
    get cMobile() { return this.createForm.get('mobile'); }
    get cEmail() { return this.createForm.get('email'); }
    get cAddress() { return this.createForm.get('address'); }



    // getters edit
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
                    this.cAvatar.setValue({
                        name: file.name,
                        type: file.type,
                        data: (reader.result as string).split(',')[1]
                    })
                    //console.log('file.name: ' + file.name)
                };
            };
            xhr.send()
        }
    }

    selectEventCreate(files: File): void {
        let reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = () => {
            this.cAvatar.setValue({
                name: files.name,
                type: files.type,
                data: (reader.result as string).split(',')[1]
            })
        };

        this.cAvatar.markAsDirty();
    }

    resetCreateAvatar() {
        this.setAvatarCreateDefault();
        this.cAvatar.markAsPristine();
    }

    setAvatarEditDefault(): void {
        let imageName: string = this.eAvatar.value.name;
        console.log('imageName: ' + imageName);
        if (!this.files && (imageName.startsWith('default-'))) {
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
                    this.eAvatar.setValue({
                        name: file.name,
                        type: file.type,
                        data: (reader.result as string).split(',')[1]
                    })
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
                    this.eAvatar.setValue({
                        name: file.name,
                        type: file.type,
                        data: (reader.result as string).split(',')[1]
                    })
                    console.log('setAvatarEditDefaultMenu: ' + file.name)
                };
            };
            xhr.send()
            this.eAvatar.markAsDirty();
        }
    }

    selectEventEdit(files: File): void {
        this.oldAvatar = {
            name: this.eAvatar.value.name,
            type: this.eAvatar.value.type,
            data: this.eAvatar.value.data
        };


        let reader = new FileReader();
        reader.readAsDataURL(files);
        reader.onload = () => {
            this.eAvatar.setValue({
                name: files.name,
                type: files.type,
                data: (reader.result as string).split(',')[1]
            })
        };

        this.eAvatar.markAsDirty();
    }

    restoreEditAvatar() {
        this.eAvatar.setValue({
            name: this.oldAvatar.name,
            type: this.oldAvatar.type,
            data: this.oldAvatar.data
        })
    }

    resetEditAvatar() {
        this.restoreEditAvatar();
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
        return (this.createForm.value.birthday != null) ? moment(this.createForm.value.birthday).format('DD/MM/YYYY') : null;
    }

    afterEditRoles(user: User) {
        console.log('afterEditRoles called!!');
        this.user = user;
        this.eRoles.setValue(user.roles);
        this.setAvatarEditDefault();
        if (this.uriRole === URI_MANAGERS) {
            if (!user.roles.includes(ROLE_MANAGER)) this.dialogRef.close();
        } else if (this.uriRole === URI_TEACHERS) {
            if (!user.roles.includes(ROLE_TEACHER)) this.dialogRef.close();
        } else {
            console.error('NO uriRole');
        }
    }


    cancel(): void {
        this.dialogRef.close(RESULT_CANCELED);
    }

    detailEdit(): void {
        this.dialogRef.close(RESULT_EDIT);
    }

    detailDelete(): void {
        this.dialogRef.close(RESULT_DELETE);
    }

    create(): void {
        this.createForm.value.username = this.createAutoUsername();
        this.createForm.value.password = this.createAutoPassword();
        this.createForm.value.birthday = this.createBirthday();
        //if (this.createForm.value.avatar === null) this.setAvatarCreateDefault();
        this.createForm.value.dni = (this.cDni.value === "") ? null : this.cDni.value;
        this.createForm.value.mobile = (this.cMobile.value === "") ? null : this.cMobile.value;
        this.createForm.value.email = (this.cEmail.value === "") ? null : this.cEmail.value;
        this.createForm.value.address = (this.cAddress.value === "") ? null : this.cAddress.value;

        let userCreate: User = this.createForm.value;
        this.dialogRef.close(RESULT_ACCEPT);

    }

    save(): void {
        this.editForm.value.username = this.eUsername.value;
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.editForm.value.dni = (this.eDni.value === "") ? null : this.eDni.value;
        this.editForm.value.mobile = (this.eMobile.value === "") ? null : this.eMobile.value;
        this.editForm.value.email = (this.eEmail.value === "") ? null : this.eEmail.value;
        this.editForm.value.address = (this.eAddress.value === "") ? null : this.eAddress.value;
        // this.user = this.editForm.value;
        let userEdit: User = this.editForm.value;
        this.dialogRef.close(RESULT_ACCEPT);

    }

    delete(): void {
        this.dialogRef.close(RESULT_ACCEPT);
    }



}

