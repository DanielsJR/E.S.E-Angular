import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { UserService } from '../../../shared/services/users.service';
import { UserStoreService } from '../../../shared/services/user-store.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nx-users-dialog-ref',
    templateUrl: './users-dialog-ref.component.html',
    styles: [`
    .app-input-icon {
        font-size: 16px;
      },

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
       // console.log('objDialogRef:' + JSON.stringify(this.obj));
    }

    buildForm() {
        this.createForm = this.formBuilder.group({
            mobile: [this.obj.mobile, Validators.required],
            username: [this.obj.username, Validators.required],
            password: [this.obj.password, Validators.required],
            /* dni: [this.obj.dni],
             address: [this.obj.address],
             email: [this.obj.email] */
        });
        this.editForm = this.formBuilder.group({
            mobile: [this.obj.mobile, Validators.required],
            username: [this.obj.username, Validators.required],
            password: [this.obj.password, Validators.required],

           /*  id: [this.obj.id, Validators.required],
            dni: [this.obj.dni],
            address: [this.obj.address],
            email: [this.obj.email]*/
        });
    }

    // getters create
    get cMobile() { return this.createForm.get('mobile'); }
    get cUsername() { return this.createForm.get('username'); }
    get cPassword() { return this.createForm.get('password'); }
    /*  get cDni() { return this.createForm.get('dni'); }
      get cAddress() { return this.createForm.get('address'); }
      get cEmail() { return this.createForm.get('email'); }  */

    // getters edit
    get eIsbn() { return this.createForm.get('id'); }
    get eTitle() { return this.createForm.get('username'); }
    get eAuthor() { return this.createForm.get('dni'); }
    get eTheme() { return this.createForm.get('address'); }
    get eEmail() { return this.createForm.get('email'); }


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