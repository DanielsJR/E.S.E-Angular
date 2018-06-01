import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
        this.isAdmin = this.checkForAdmin(this.localStorageService.getRolesParsed());
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
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            dni: [],
            birthday: [],
            gender: [],
            avatar: [],
            mobile: [],
            email: [],
            address: [],
            commune: [],
        });


        this.editForm = this.formBuilder.group({
            id: [this.user.id],
            username: [this.user.username, Validators.required],
            //password: [],
            firstName: [this.user.firstName, Validators.required],
            lastName: [this.user.lastName, Validators.required],
            dni: [this.user.dni],
            birthday: [(this.user.birthday != null) ? moment(this.user.birthday, 'DD/MM/YYYY') : null],
            gender: [this.user.gender],
            avatar: [this.user.avatar],
            mobile: [this.user.mobile],
            email: [this.user.email],
            address: [this.user.address],
            commune: [this.user.commune],
            //roles: [this.user.roles]

        });

    }



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
        this.createForm.markAsDirty();
    };

    resetCreateAvatar() {
        this.createForm.get('avatar').setValue(this.user.avatar);
        this.createForm.markAsPristine();
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

        this.editForm.markAsDirty();
    };

    resetEditAvatar() {
        this.editForm.get('avatar').setValue(this.user.avatar);
        this.editForm.markAsPristine();
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



    // getters create for template
    get cFirstName() { return this.createForm.get('firstName'); }
    get cLastName() { return this.createForm.get('lastName'); }
    get cEmail() { return this.createForm.get('email'); }
    get cAvatar() { return this.createForm.get('avatar'); }
    // getters edit
    get eUsername() { return this.editForm.get('username'); }
    get eFirstName() { return this.editForm.get('firstName'); }
    get eLastName() { return this.editForm.get('lastName'); }
    //get eRoles() { return this.editForm.get('roles'); }


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
        this.user = this.createForm.value;
        //  console.log('creating... ' + JSON.stringify(this.user));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.create(this.user);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.create(this.user);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.create(this.user);

        } else {
            console.error('NO uriRole');
        }

    }

    save(): void {
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        // this.editForm.value.roles = this.user.roles;
        this.user = this.editForm.value;

        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.update(this.user);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.update(this.user);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.update(this.user);

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

