import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GENDERS } from '../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { ROLE_ADMIN, ROLE_ADMIN_SPANISH, ROLE_MANAGER, ROLE_MANAGER_SPANISH, ROLE_TEACHER, ROLE_TEACHER_SPANISH, ROLE_STUDENT, ROLE_STUDENT_SPANISH, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS } from '../../app.config';
import { COMMUNNES } from '../../models/communes';
import * as moment from 'moment';
import { UserBackendService } from '../../services/user-backend.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { TdFileInputComponent } from '@covalent/core';


@Component({
    selector: 'nx-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    @Input()
    user: User;

    @Input()
    uriRole: string;

    private _profileAction: string;

    get profileAction(): string { return this._profileAction; }

    @Input()
    set profileAction(profileAction: string) {
        this._profileAction = profileAction;

        this.profileActionTitle = (this.profileAction === 'usuario') ? 'Datos de Usuario' :
            (this.profileAction === 'personal') ? 'Datos Personales' : 'Datos de Contacto';

        this.title.emit(this.profileActionTitle);
    }


    @Output()
    title = new EventEmitter<string>();

    profileActionTitle: string = '';


    editProfileForm: FormGroup;
    genders = GENDERS;
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
    communes = COMMUNNES;

    files: File | FileList;

    @ViewChild(TdFileInputComponent)
    fileInput: TdFileInputComponent;


    constructor(private formBuilder: FormBuilder, private userService: UserBackendService,
        private userLoggedService: UserLoggedService,
        public sanitizer: DomSanitizer, private snackbarService: SnackbarService) {
        //console.log('*** UserName: ' + this.user.firstName + ' uriRol: ' + this.uriRole);
    }

    ngOnInit() {
        this.buildForm();
    }

    buildForm() {

        this.editProfileForm = this.formBuilder.group({
            id: [this.user.id],
            username: [this.user.username, Validators.required],
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

        });

    }

    selectEventEdit(files: FileList | File): void {
        let reader = new FileReader();
        if (files instanceof FileList) {

        } else {
            reader.readAsDataURL(files);
            reader.onload = () => {
                this.editProfileForm.get('avatar').setValue({
                    name: files.name,
                    type: files.type,
                    data: reader.result.split(',')[1]
                })
            };
        }
        this.editProfileForm.markAsDirty();
    };

    resetAvatar(){
        this.editProfileForm.get('avatar').setValue(this.user.avatar);
        this.editProfileForm.markAsPristine();
    }

    compareByViewValue(a1: any, a2: any) {
        // console.log('a1: ' + a1 + '    '+'a2: ' + a2);
        return a1 && a2 && a1 === a2;
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


    // getters edit
    get eUsername() { return this.editProfileForm.get('username'); }
    get eFirstName() { return this.editProfileForm.get('firstName'); }
    get eLastName() { return this.editProfileForm.get('lastName'); }



    save(): void {
        this.editProfileForm.value.birthday = (this.editProfileForm.value.birthday != null) ? moment(this.editProfileForm.value.birthday).format('DD/MM/YYYY') : null;
        this.editProfileForm.value.gender = (this.editProfileForm.value.gender != null) ? this.editProfileForm.value.gender.toUpperCase() : null;
        this.editProfileForm.value.commune = (this.editProfileForm.value.commune != null) ? this.editProfileForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.user = this.editProfileForm.value;
        this.userService.update(this.user, this.uriRole).subscribe(user => {
           // this.user = user;
            this.userLoggedService.userLogged(user);
            if (this.fileInput) this.fileInput.clear();
            this.editProfileForm.markAsPristine();
            this.openSnackBar('Datos Actualizados', 'success');
        },
            error => {
                this.openSnackBar(error, 'error');
                console.error('error updating user ' + error)
            });

    }

    openSnackBar(message: string, type: any): void {
        let data = {
            message: message,
            uriRole: 'none',
            type: type
        };

        let snackBarRef = this.snackbarService.openSnackBar(data);
    }


}
