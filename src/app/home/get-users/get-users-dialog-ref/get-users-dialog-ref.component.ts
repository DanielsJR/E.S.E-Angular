import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../models/user';
import { GetUsersStoreService } from '../get-users-store.service';


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
 
    constructor(
        public dialogRef: MatDialogRef<GetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userStoreservice: GetUsersStoreService, private formBuilder: FormBuilder
    ) {
        this.obj = data.obj;
        this.uriRole = data.uriRole;
    }

    ngOnInit(): void {
        this.buildForm();
        console.log('objDialogRef:' + JSON.stringify(this.obj.id));
        console.log('dataDialogRef:' + JSON.stringify(this.uriRole));
        this.userStoreservice.uriRole = this.uriRole;
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
            password: [this.obj.password],
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
