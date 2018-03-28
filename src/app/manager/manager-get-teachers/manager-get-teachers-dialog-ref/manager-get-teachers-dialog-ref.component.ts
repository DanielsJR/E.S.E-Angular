import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../../models/user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ManagerGetTeachersStoreService } from '../manager-get-teachers-store.service';


@Component({
  templateUrl: './manager-get-teachers-dialog-ref.component.html',
  styleUrls: ['./manager-get-teachers-dialog-ref.component.css']
})
export class ManagerGetTeachersDialogRefComponent implements OnInit {

  createForm: FormGroup;
  editForm: FormGroup;
  obj: User;
 // objs: User[] = [];

  constructor(
      public dialogRef: MatDialogRef<ManagerGetTeachersDialogRefComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private userStoreservice: ManagerGetTeachersStoreService, private formBuilder: FormBuilder
  ) {
      this.obj = data.obj;
    }

  ngOnInit(): void {
      this.buildForm();
      console.log('objDialogRef:' + JSON.stringify(this.obj.id));
  }

  buildForm() {
      this.createForm = this.formBuilder.group({
          userName: [this.obj.username, Validators.required],
          firstName: [this.obj.firstName],
          lastName: [this.obj.lastName],
          dni: [this.obj.dni],
          age:[this.obj.birthday],
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
          userName: [this.obj.username, Validators.required],
          firstName: [this.obj.firstName],
          lastName: [this.obj.lastName],
          dni: [this.obj.dni],
          age:[this.obj.birthday],
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
      this.userStoreservice.delete(this.obj.username);
      this.dialogRef.close('deleted');
  }


}
