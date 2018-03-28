import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { UserService } from '../../../shared/services/users.service';
import { AdminGetUsersStoreService } from '../admin-get-users-store.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    // tslint:disable-next-line:component-selector
    templateUrl: './admin-get-users-dialog-ref.component.html',
    styles: [`
    .app-input-icon { font-size: 16px; },
    `]
})

export class AdminGetUsersDialogRefComponent implements OnInit {

    createForm: FormGroup;
    editForm: FormGroup;
    obj: User;

    constructor(
        public dialogRef: MatDialogRef<AdminGetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userStoreservice: AdminGetUsersStoreService, private formBuilder: FormBuilder
    ) {
        this.obj = data.obj;
    }

    ngOnInit(): void {
        this.buildForm();
        console.log('objDialogRef:' + JSON.stringify(this.obj.id));
    }

    buildForm() {
        this.createForm = this.formBuilder.group({
            username: [this.obj.username, Validators.required],
            password: [this.obj.password, Validators.required],
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            birthday: [this.obj.birthday],
            gender: [this.obj.gender],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            commune: [this.obj.commune],
            roles:[this.obj.roles]
        });
        this.editForm = this.formBuilder.group({
            id: [this.obj.id],
            username: [this.obj.username, Validators.required],
            password: [this.obj.password, Validators.required],
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            birthday: [this.obj.birthday],
            gender: [this.obj.gender],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            commune: [this.obj.commune],
            roles:[this.obj.roles]

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
        this.obj = this.createForm.value;
        console.log('creating... ' + JSON.stringify(this.obj));
        this.userStoreservice.create(this.obj);
        this.dialogRef.close('created');
    }

    save(): void {
        this.obj = this.editForm.value;
        console.log('saving... ' + JSON.stringify(this.obj));
        this.userStoreservice.update(this.obj);
        this.dialogRef.close('');
    }

    delete(): void {
        console.log('deleting... ' + JSON.stringify(this.obj));
        this.userStoreservice.delete(this.obj.id);
        this.dialogRef.close('deleted');
    }

}
