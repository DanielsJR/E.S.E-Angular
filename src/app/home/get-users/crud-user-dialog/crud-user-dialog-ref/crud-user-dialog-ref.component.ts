import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, Input, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../../models/user';
import { ManagerStoreService } from '../../../../services/manger-store.service';
import { TeacherStoreService } from '../../../../services/teacher-store.service';
import { StudentStoreService } from '../../../../services/student-store.service';
import {
    URI_TEACHERS, URI_MANAGERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT,
    ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH
} from '../../../../app.config';
import * as moment from 'moment';
import { COMMUNNES } from '../../../../models/communes';
import { GENDERS } from '../../../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { PRIVILEGES } from '../../../../models/privileges';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { Subscription } from 'rxjs';
import { noWhitespaceValidator } from '../../../../shared/validators/no-white-space-validator';
import { rutValidator } from '../../../../shared/validators/rut-validator';
import { PHONE_PATTERN, NAME_PATTERN } from '../../../../shared/validators/patterns';
import { Avatar } from '../../../../models/avatar';


@Component({
    templateUrl: './crud-user-dialog-ref.component.html',
    styleUrls: ['./crud-user-dialog-ref.component.css']
})

export class CrudUserDialogRefComponent implements OnInit, OnDestroy {

    createForm: FormGroup;
    editForm: FormGroup;
    user: User;
    uriRole: string;
    privilege: string;
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
    communes = COMMUNNES;
    genders = GENDERS;
    rolesList = PRIVILEGES;
    files: File | FileList;
    hidePass = true;
    isAdmin = false;
    userLoggedRoles = this.localStorageService.getTokenRoles();

    userHightPrivilege: string;
    oldAvatar: Avatar;

    subscriptionCreateSuccess: Subscription;
    subscriptionUpdateSuccess: Subscription;
    subscriptionDeleteSuccess: Subscription;
    subscriptionSetRolesSuccess: Subscription;
    subscriptionIsLoading: Subscription;

    isLoading = false;


    constructor(public dialogRef: MatDialogRef<CrudUserDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private managerStoreService: ManagerStoreService,
        private teacherStoreService: TeacherStoreService,
        private studentStoreService: StudentStoreService,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer,
        private localStorageService: LocalStorageService) {

        this.user = data.user;
        this.uriRole = data.uriRole;
        this.privilege = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
        // if (this.data.type === 'edit') this.userHightPrivilege = data.user.roles[0].toLowerCase();
        console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type + ' this.userHightPrivilege: ' + this.userHightPrivilege);
    }

    ngOnInit(): void {
        this.buildForm();
        if (this.data.type === 'create') {
            this.setAvatarCreateDefault();
        }

        this.isAdmin = this.checkForAdmin(this.localStorageService.getTokenRoles());

        if (this.uriRole === URI_MANAGERS) {
            this.subscriptionIsLoading = this.managerStoreService.isLoading$.subscribe(isLoadding => this.isLoading = isLoadding);

            this.subscriptionCreateSuccess = this.managerStoreService.createSuccess$.subscribe(_ => {
                this.dialogRef.close('created');
            });

            this.subscriptionUpdateSuccess = this.managerStoreService.updateSuccess$.subscribe(user => {
                this.teacherStoreService.updateUserFromStore(user);
                this.dialogRef.close('edited');
            });

            this.subscriptionDeleteSuccess = this.managerStoreService.deleteSuccess$.subscribe((user) => {
                this.teacherStoreService.deleteUserFromStore(user);
                this.dialogRef.close('deleted');
            });

            this.subscriptionSetRolesSuccess = this.managerStoreService.setRoles$.subscribe(user => {
                this.user = user;
                this.eRoles.setValue(user.roles);
                this.setAvatarEditDefault();
                if (!user.roles.includes(ROLE_MANAGER)) this.dialogRef.close();
            });


        } else if (this.uriRole === URI_TEACHERS) {
            this.subscriptionIsLoading = this.teacherStoreService.isLoading$.subscribe(isLoadding => this.isLoading = isLoadding);
            this.subscriptionCreateSuccess = this.teacherStoreService.createSuccess$.subscribe(_ => {
                this.dialogRef.close('created');
            });

            this.subscriptionUpdateSuccess = this.teacherStoreService.updateSuccess$.subscribe(user => {
                this.managerStoreService.updateUserFromStore(user);
                this.dialogRef.close('edited');
            });

            this.subscriptionDeleteSuccess = this.teacherStoreService.deleteSuccess$.subscribe((user) => {
                this.managerStoreService.deleteUserFromStore(user);
                this.dialogRef.close('deleted');
            });

            this.subscriptionSetRolesSuccess = this.teacherStoreService.setRoles$.subscribe(user => {
                this.user = user;
                this.eRoles.setValue(user.roles);
                this.setAvatarEditDefault();
                if (!user.roles.includes(ROLE_TEACHER)) this.dialogRef.close();
            });


        } else if (this.uriRole === URI_STUDENTS) {
            this.subscriptionIsLoading = this.studentStoreService.isLoading$.subscribe(isLoadding => this.isLoading = isLoadding);
            this.subscriptionCreateSuccess = this.studentStoreService.createSuccess$.subscribe(_ => {
                this.dialogRef.close('created');
            });

            this.subscriptionUpdateSuccess = this.studentStoreService.updateSuccess$.subscribe(user => {
                this.dialogRef.close('edited');
            });

            this.subscriptionDeleteSuccess = this.studentStoreService.deleteSuccess$.subscribe((user) => {
                this.dialogRef.close('deleted');
            });

        } else {
            console.error('NO uriRole');
        }

    }

    ngOnDestroy() {
        this.subscriptionCreateSuccess.unsubscribe();
        this.subscriptionUpdateSuccess.unsubscribe();
        this.subscriptionDeleteSuccess.unsubscribe();
        if (this.subscriptionSetRolesSuccess) this.subscriptionSetRolesSuccess.unsubscribe();
        this.subscriptionIsLoading.unsubscribe();
    }

    convertDate(birthDay: any) {
        return (this.user.birthday != null) ? birthDay = moment(this.user.birthday, 'DD/MM/YYYY') : null;
    }

    compareByViewValue(a1: any, a2: any) {
        // console.log('a1: ' + a1 + '    '+'a2: ' + a2);
        return a1 && a2 && a1 === a2;
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


    checkForAdmin(roles: string[]): boolean {
        for (let role of roles) {
            if (role === ROLE_ADMIN) {
                return true;
            }
        }
        return false;
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
            username: [this.user.username, [Validators.required, noWhitespaceValidator]],
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
            xhr.open("GET", `../assets/images/users/default-${this.cGender.value.toLowerCase()}-${this.privilege}.png`, true);
            xhr.responseType = "blob";
            xhr.onload = () => {
                let reader = new FileReader();
                let file = xhr.response;
                file.name = `default-${this.cGender.value.toLowerCase()}-${this.privilege}.png`;
                reader.readAsDataURL(file);
                reader.onload = () => {
                    this.cAvatar.setValue({
                        name: file.name,
                        type: file.type,
                        data: reader.result.split(',')[1]
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
                data: reader.result.split(',')[1]
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
                        data: reader.result.split(',')[1]
                    })
                    console.log('file.name: ' + file.name)
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
                        data: reader.result.split(',')[1]
                    })
                    console.log('file.name: ' + file.name)
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
                data: reader.result.split(',')[1]
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


    cancel(): void {
        this.dialogRef.close('canceled');
    }

    detailEdit(): void {
        this.dialogRef.close('edit');
    }

    detailDelete(): void {
        this.dialogRef.close('delete');
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

        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.create(userCreate);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.create(userCreate);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.create(userCreate);

        } else {
            console.error('NO uriRole');
        }

    }

    save(): void {
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.editForm.value.dni = (this.eDni.value === "") ? null : this.eDni.value;
        this.editForm.value.mobile = (this.eMobile.value === "") ? null : this.eMobile.value;
        this.editForm.value.email = (this.eEmail.value === "") ? null : this.eEmail.value;
        this.editForm.value.address = (this.eAddress.value === "") ? null : this.eAddress.value;
        // this.user = this.editForm.value;
        let userEdit: User = this.editForm.value;

        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.update(userEdit);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.update(userEdit);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.update(userEdit);

        } else {
            console.error('NO uriRole');
        }

    }

    delete(): void {
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.delete(this.user);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.delete(this.user);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.delete(this.user);

        } else {
            console.error('NO uriRole');
        }

    }

}

