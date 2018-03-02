import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { UserService } from '../../../shared/services/users.service';
import { UserStoreService } from '../user-store.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nx-users-dialog-ref',
    templateUrl: './users-dialog-ref.component.html',
    styles: [`
    .app-input-icon { font-size: 16px; },
    `]
})

export class UsersDialogRefComponent implements OnInit {

    createForm: FormGroup;
    editForm: FormGroup;
    obj: User;
   // objs: User[] = [];

    constructor(
        public dialogRef: MatDialogRef<UsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userStoreservice: UserStoreService, private formBuilder: FormBuilder
    ) {
        this.obj = data.obj;
      }

    ngOnInit(): void {
        this.buildForm();
        console.log('objDialogRef:' + JSON.stringify(this.obj.id));
    }

    buildForm() {
        this.createForm = this.formBuilder.group({
            userName: [this.obj.userName, Validators.required],
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            age:[this.obj.age],
            gender:[this.obj.gender],
            password: [this.obj.password, Validators.required],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            active:[this.obj.active],
           // roles:[this.obj.roles]
        });
        this.editForm = this.formBuilder.group({
            id: [this.obj.id],
            userName: [this.obj.userName, Validators.required],
            firstName: [this.obj.firstName],
            lastName: [this.obj.lastName],
            dni: [this.obj.dni],
            age:[this.obj.age],
            gender:[this.obj.gender],
            password: [this.obj.password, Validators.required],
            mobile: [this.obj.mobile],
            email: [this.obj.email],
            address: [this.obj.address],
            active:[this.obj.active],
           // roles:[this.obj.roles]
            
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
        this.dialogRef.close('saved');
    }

    delete(): void {
        console.log('deleting... ' + JSON.stringify(this.obj));
        this.userStoreservice.delete(this.obj.id);
        this.dialogRef.close('deleted');
    }


}
