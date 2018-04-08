import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../models/user';
import { ManagerStoreService } from '../../../services/manger-store.service';
import { TeacherStoreService } from '../../../services/teacher-store.service';
import { StudentStoreService } from '../../../services/student-store.service';
import { URI_TEACHERS, URI_MANAGERS, URI_STUDENTS } from '../../../app.config';

import * as moment from 'moment';

@Component({
    // tslint:disable-next-line:component-selector
    templateUrl: './get-users-dialog-ref.component.html',
    styles: [`
    .app-input-icon { font-size: 16px; },
    `]
})

export class GetUsersDialogRefComponent implements OnInit {

    createForm: FormGroup;
    editForm: FormGroup;
    obj: User;
    uriRole: string;



    communes = [
        { value: 'LO_PRADO', viewValue: 'Lo Prado' },
        { value: 'QUINTA_NORMAL', viewValue: 'Quinta Normal' },
        { value: 'LA_FLORIDA', viewValue: 'La Florida' }
    ];


    constructor(
        public dialogRef: MatDialogRef<GetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private managerStoreService: ManagerStoreService,
        private teacherStoreService: TeacherStoreService,
        private studentStoreService: StudentStoreService,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar
    ) {
        this.obj = data.obj;
        this.uriRole = data.uriRole;
    }


    ngOnInit(): void {
        this.buildForm();
        console.log('objDialogRef:' + JSON.stringify(this.obj.id));
        console.log('dataDialogRef:' + JSON.stringify(this.uriRole));
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    buildForm() {
        this.createForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            firstName: [],
            lastName: [],
            dni: [],
            birthday: [],
            gender: [],
            mobile: [],
            email: [],
            address: [],
            commune: [],
            //roles: [this.obj.roles]
        });
        
        this.editForm = this.formBuilder.group({
            id: [this.obj.id],
            username: [this.obj.username, Validators.required],
            // password: [this.obj.password],
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            birthday: [moment(this.obj.birthday,'DD/MM/YYYY')],
            gender: [this.obj.gender],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            commune: [this.obj.commune],
            roles: [this.obj.roles]

        });
    }

    // getters create
    //  get cUserName() { return this.createForm.get('userName'); }
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
        if (this.createForm.value.birthday != null) {
            this.createForm.value.birthday = moment(this.createForm.value.birthday).format('DD/MM/YYYY');
        }
        this.obj = this.createForm.value;
        console.log('creating... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.managerStoreService.create(this.obj);
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.teacherStoreService.create(this.obj);
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('created'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.studentStoreService.create(this.obj);
        }

    }

    save(): void {
        if (this.editForm.value.birthday != null) {
            this.editForm.value.birthday = moment(this.editForm.value.birthday).format('DD/MM/YYYY');
        }
        this.obj = this.editForm.value;
        console.log('saving... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.managerStoreService.update(this.obj);
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.teacherStoreService.update(this.obj);
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('edited'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.studentStoreService.update(this.obj);
        }

    }

    delete(): void {
        console.log('deleting... ' + JSON.stringify(this.obj));
        if (this.uriRole === URI_MANAGERS) {
            this.managerStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.managerStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.managerStoreService.delete(this.obj.id);
        } else if (this.uriRole === URI_TEACHERS) {
            this.teacherStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.teacherStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.teacherStoreService.delete(this.obj.id);
        } else if (this.uriRole === URI_STUDENTS) {
            this.studentStoreService.success$.subscribe(() => this.dialogRef.close('deleted'));
            this.studentStoreService.error$.subscribe(() => this.dialogRef.close('error'));
            this.studentStoreService.delete(this.obj.id);
        }

    }

}
