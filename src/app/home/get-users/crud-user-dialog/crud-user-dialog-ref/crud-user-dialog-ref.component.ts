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


@Component({
    templateUrl: './crud-user-dialog-ref.component.html',
    styleUrls: ['./crud-user-dialog-ref.component.css']
})

export class CrudUserDialogRefComponent implements OnInit {

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

    subscriptionCreateSuccess: Subscription;
    subscriptionUpdateSuccess: Subscription;
    subscriptionDeleteSuccess: Subscription;
    subscriptionSetRolesSuccess: Subscription;



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
        console.log('Dialog*** UserName: ' + data.user.firstName + ' uriRol: ' + data.uriRole + ' type: ' + data.type);
    }

    ngOnInit(): void {
        this.buildForm();
        this.isAdmin = this.checkForAdmin(this.localStorageService.getTokenRoles());
        //JSON.stringify(this.user.id);

        if (this.uriRole === URI_MANAGERS) {
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
                if (!user.roles.includes(ROLE_MANAGER)) this.dialogRef.close();
            });


        } else if (this.uriRole === URI_TEACHERS) {
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
                if (!user.roles.includes(ROLE_TEACHER)) this.dialogRef.close();
            });


        } else if (this.uriRole === URI_STUDENTS) {
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
            gender: [],
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

    // getters create for template
    get cFirstName() { return this.createForm.get('firstName'); }
    get cLastName() { return this.createForm.get('lastName'); }
    get cBirthday() { return this.createForm.get('birthday'); }
    get cDni() { return this.createForm.get('dni'); }
    get cEmail() { return this.createForm.get('email'); }
    get cMobile() { return this.createForm.get('mobile'); }
    get cAddress() { return this.createForm.get('address'); }
    get cAvatar() { return this.createForm.get('avatar'); }

    // getters edit
    get eUsername() { return this.editForm.get('username'); }
    get eFirstName() { return this.editForm.get('firstName'); }
    get eLastName() { return this.editForm.get('lastName'); }
    get eBirthday() { return this.editForm.get('birthday'); }
    get eDni() { return this.editForm.get('dni'); }
    get eEmail() { return this.editForm.get('email'); }
    get eMobile() { return this.editForm.get('mobile'); }
    get eAddress() { return this.editForm.get('address'); }
    get eAvatar() { return this.editForm.get('avatar'); }


    selectEventCreate(files: FileList | File): void {
        let reader = new FileReader();
        if (files instanceof FileList) {

        } else {
            reader.readAsDataURL(files);
            reader.onload = () => {
                this.createForm.get('avatar').setValue({
                    name: files.name,
                    type: files.type,
                    data: reader.result.split(',')[1]
                })
            };
        }
        this.createForm.get('avatar').markAsDirty();
    };

    resetCreateAvatar() {
        this.createForm.get('avatar').setValue(this.user.avatar);
        this.createForm.get('avatar').markAsPristine();
    }

    selectEventEdit(files: FileList | File): void {
        let reader = new FileReader();
        if (files instanceof FileList) {

        } else {
            reader.readAsDataURL(files);
            reader.onload = () => {
                this.editForm.get('avatar').setValue({
                    name: files.name,
                    type: files.type,
                    data: reader.result.split(',')[1]
                })
            };
        }

        this.editForm.get('avatar').markAsDirty();
    };

    resetEditAvatar() {
        this.editForm.get('avatar').setValue(this.user.avatar);
        this.editForm.get('avatar').markAsPristine();
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

