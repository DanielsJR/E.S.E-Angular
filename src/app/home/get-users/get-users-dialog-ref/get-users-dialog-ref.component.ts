import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material';
import { User } from '../../../models/user';
import { ManagerStoreService } from '../../../services/manger-store.service';
import { TeacherStoreService } from '../../../services/teacher-store.service';
import { StudentStoreService } from '../../../services/student-store.service';
import { URI_TEACHERS, URI_MANAGERS, URI_STUDENTS } from '../../../app.config';
import * as moment from 'moment';
import { COMMUNNES } from '../../../models/communes';
import { GENDERS } from '../../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from '../../../services/dialog.service';
import { ImageUserDialogRefComponent } from '../image-user-dialog-ref/image-user-dialog-ref.component';
import { ResetPassDialogRefComponent } from '../reset-pass-dialog-ref/reset-pass-dialog-ref.component';


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
    files: File | FileList;
    hidePass = true;


    constructor(public dialogRef: MatDialogRef<GetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private managerStoreService: ManagerStoreService,
        private teacherStoreService: TeacherStoreService,
        private studentStoreService: StudentStoreService,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer,
        private dialogService: DialogService, ) {

        this.obj = data.model;
        this.uriRole = data.uriRole;
        this.privilege = this.uriRole.replace('/', '').slice(0, this.uriRole.length - 2);
    }

    ngOnInit(): void {
        this.buildForm();
        console.log('objDialogRef:' + JSON.stringify(this.obj.id));
        console.log('dataDialogRef:' + JSON.stringify(this.uriRole));
        console.log('this.privilege:' + this.privilege);
    }

    convertDate(birthDay: any) {
        return (this.obj.birthday != null) ? birthDay = moment(this.obj.birthday, 'DD/MM/YYYY') : null;
    }

    compareByViewValue(a1: any, a2: any) {
        // console.log('a1: ' + a1 + '    '+'a2: ' + a2);
        return a1 && a2 && a1 === a2;
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
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            birthday: [(this.obj.birthday != null) ? moment(this.obj.birthday, 'DD/MM/YYYY') : null],
            gender: [this.obj.gender],
            avatar: [this.obj.avatar],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            commune: [this.obj.commune],
            // roles: [this.obj.roles]

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

    // getters create for errors messages template
    get cFirstName() { return this.createForm.get('firstName'); }
    get cLastName() { return this.createForm.get('lastName'); }
    get cEmail() { return this.createForm.get('email'); }
    get cAvatar() { return this.createForm.get('avatar'); }
    // getters edit
    //  get eUserName() { return this.createForm.get('userName'); }


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
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.create(this.obj);
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.create(this.obj);
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        }

    }

    save(): void {
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.obj = this.editForm.value;
        //  console.log('saving... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.update(this.obj);
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.update(this.obj);
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.update(this.obj);
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        }

    }

    delete(): void {
        //  console.log('deleting... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.delete(this.obj.id);
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.delete(this.obj.id);
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.delete(this.obj.id);
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
        }

    }

    openDialogImage(user: User): void {
        let config = new MatDialogConfig();
        config.data = {
            model: user,
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


    openDialogResetPass( user: User): void {
        let config = new MatDialogConfig();
        config.data = {
            model: user,
            uriRole: this.uriRole,
        };
        config.panelClass = 'dialogService';
        config.width = '500px';
        config.height = 'auto';
         this.dialogService.openDialogResetPass(ResetPassDialogRefComponent, config);
    }
}
