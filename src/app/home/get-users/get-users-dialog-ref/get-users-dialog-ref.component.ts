import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user';
import { ManagerStoreService } from '../../../services/manger-store.service';
import { TeacherStoreService } from '../../../services/teacher-store.service';
import { StudentStoreService } from '../../../services/student-store.service';
import { URI_TEACHERS, URI_MANAGERS, URI_STUDENTS } from '../../../app.config';
import * as moment from 'moment';
import { COMMUNNES } from '../../../models/communes';
import { GENDERS } from '../../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';


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
 

    constructor(public dialogRef: MatDialogRef<GetUsersDialogRefComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private managerStoreService: ManagerStoreService,
        private teacherStoreService: TeacherStoreService,
        private studentStoreService: StudentStoreService,
        private formBuilder: FormBuilder, public sanitizer: DomSanitizer) {

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
            // password: [this.obj.password],
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
        this.createForm.value.username = (this.createForm.value.firstName + ' ' + this.createForm.value.lastName).replace(/ /g, '_');
        this.createForm.value.password = this.createForm.value.firstName + '1@';
        this.createForm.value.birthday = (this.createForm.value.birthday != null) ? moment(this.createForm.value.birthday).format('DD/MM/YYYY') : null;
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
        this.editForm.value.birthday = (this.editForm.value.birthday != null) ? moment(this.editForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editForm.value.gender = (this.editForm.value.gender != null) ? this.editForm.value.gender.toUpperCase() : null;
        this.editForm.value.commune = (this.editForm.value.commune != null) ? this.editForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
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
