import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar } from '@angular/material';
import { User } from '../../../models/user';
import { ManagerStoreService } from '../../../services/manger-store.service';
import { TeacherStoreService } from '../../../services/teacher-store.service';
import { StudentStoreService } from '../../../services/student-store.service';
import { URI_TEACHERS, URI_MANAGERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../../../app.config';
import * as moment from 'moment';
import { COMMUNNES } from '../../../models/communes';
import { GENDERS } from '../../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from '../../../services/dialog.service';
import { ImageUserDialogRefComponent } from '../image-user-dialog-ref/image-user-dialog-ref.component';
import { ResetPassDialogRefComponent } from '../reset-pass-dialog-ref/reset-pass-dialog-ref.component';
import { PRIVILEGES } from '../../../models/privileges';
import { SetRolesDialogRefComponent } from '../set-roles-dialog-ref/set-roles-dialog-ref.component';
import { LocalStorageService } from '../../../services/local-storage.service';


@Component({
    templateUrl: './get-users-dialog-ref.component.html',
    styleUrls: ['./get-users-dialog-ref.component.css']
})

export class GetUsersDialogRefComponent implements OnInit {

    createForm: FormGroup;
    editForm: FormGroup;
    obj: User;
    uriRole: string;
    privilege: string;
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
    communes = COMMUNNES;
    genders = GENDERS;
    rolesList = PRIVILEGES;
    files: File | FileList;
    hidePass = true;
    isAdmin = false;


    constructor(public dialogRef: MatDialogRef<GetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private managerStoreService: ManagerStoreService,
        private teacherStoreService: TeacherStoreService,
        private studentStoreService: StudentStoreService,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer,
        private dialogService: DialogService, public snackBar: MatSnackBar,
        private localStorageService: LocalStorageService) {

        this.obj = data.model;
        this.uriRole = data.uriRole;
        this.privilege = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    }

    ngOnInit(): void {
        this.buildForm();
        this.isAdmin = this.checkForAdmin(this.localStorageService.getRolesParsed());
        /* console.log('objDialogRef:' + JSON.stringify(this.obj.id));
         console.log('dataDialogRef:' + JSON.stringify(this.uriRole));
         console.log('this.privilege:' + this.privilege); */
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));

            this.managerStoreService.setRoles$.subscribe(user => {
                if (!user.roles.includes(ROLE_MANAGER)) this.dialogRef.close();
            });

            this.managerStoreService.updateSuccess$.subscribe(user => {
                this.teacherStoreService.updateUserFromStore(user);
                this.dialogRef.close('edited');
                setTimeout(() => this.openSnackBar('Usuario Actualizado', 'info'));

            })
            this.managerStoreService.deleteSuccess$.subscribe((user) => {
                this.teacherStoreService.deleteUserFromStore(user);
                this.dialogRef.close('deleted');
                setTimeout(() => this.openSnackBar('Usuario Borrado', 'info'));
            });

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));

            this.teacherStoreService.setRoles$.subscribe(user => {
                if (!user.roles.includes(ROLE_TEACHER)) this.dialogRef.close();
            });

            this.teacherStoreService.updateSuccess$.subscribe(user => {
                this.managerStoreService.updateUserFromStore(user);
                this.dialogRef.close('edited');
                setTimeout(() => this.openSnackBar('Usuario Actualizado', 'info'));
            });
            this.teacherStoreService.deleteSuccess$.subscribe((user) => {
                this.managerStoreService.deleteUserFromStore(user);
                this.dialogRef.close('deleted');
                setTimeout(() => this.openSnackBar('Usuario Borrado', 'info'));
            });


        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else {
            console.error('NO uriRole');
        }

    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

    convertDate(birthDay: any) {
        return (this.obj.birthday != null) ? birthDay = moment(this.obj.birthday, 'DD/MM/YYYY') : null;
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
            //roles: [this.obj.roles]
        });


        this.editForm = this.formBuilder.group({
            id: [this.obj.id],
            username: [this.obj.username, Validators.required],
            //password: [],
            firstName: [this.obj.firstName, Validators.required],
            lastName: [this.obj.lastName, Validators.required],
            dni: [this.obj.dni],
            birthday: [(this.obj.birthday != null) ? moment(this.obj.birthday, 'DD/MM/YYYY') : null],
            gender: [this.obj.gender],
            avatar: [this.obj.avatar],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            commune: [this.obj.commune],
            roles: [this.obj.roles, Validators.required]

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
    };

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
    };

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
    get eRoles() { return this.editForm.get('roles'); }


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
        this.obj = this.createForm.value;
        //  console.log('creating... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.create(this.obj);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.create(this.obj);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.create(this.obj);

        } else {
            console.error('NO uriRole');
        }

    }

    save(): void {
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.obj = this.editForm.value;
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.update(this.obj);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.update(this.obj);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.update(this.obj);

        } else {
            console.error('NO uriRole');
        }

    }

    delete(): void {
        //  console.log('deleting... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.delete(this.obj);

        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.delete(this.obj);

        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.delete(this.obj);

        } else {
            console.error('NO uriRole');
        }

    }

    openDialogImage(): void {
        let config = new MatDialogConfig();
        config.data = {
            model: this.obj,
            uriRole: this.uriRole,
        };
        config.panelClass = 'dialogService';
        //config.width = 'auto';
        //config.height = 'auto';
        config.maxWidth = '420px';
        config.maxHeight = '420px';
        config.minWidth = '300px';
        config.minHeight = '300px';

        this.dialogService.openDialogImage(ImageUserDialogRefComponent, config);
    }


    openDialogResetPass(): void {
        let config = new MatDialogConfig();
        config.data = {
            model: this.obj,
            uriRole: this.uriRole,
        };
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';
        this.dialogService.openDialogResetPass(ResetPassDialogRefComponent, config);
    }

    openDialogSetRoles(): void {

        let config = new MatDialogConfig();
        config.data = {
            model: this.editForm.value,
            uriRole: this.uriRole,
        };
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';
        this.dialogService.openDialogSetRoles(SetRolesDialogRefComponent, config);
    }
}
