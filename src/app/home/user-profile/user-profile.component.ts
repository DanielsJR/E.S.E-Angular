import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GENDERS } from '../../models/genders';
import { DomSanitizer } from '@angular/platform-browser';
import { COMMUNNES } from '../../models/communes';
import * as moment from 'moment';
import { UserBackendService } from '../../services/user-backend.service';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { TdFileInputComponent } from '@covalent/core/file';
import { noWhitespaceValidator } from '../../shared/validators/no-white-space-validator';
import { rutValidator } from '../../shared/validators/rut-validator';
import { NAME_PATTERN, PHONE_PATTERN } from '../../shared/validators/patterns';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { UserStoreService } from '../../services/user-store.service';
import { RESULT_ERROR, USER_UPDATE_ERROR, DD_MM_YYYY, USER_UPDATE_SUCCEED, RESULT_SUCCEED } from '../../app.config';
import { Avatar } from '../../models/avatar';


@Component({
    selector: 'nx-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    @Input()
    user: User;

    @Output()
    title = new EventEmitter<string>(true);

    profileActionTitle: string = '';

    private _profileAction: string;

    get profileAction(): string { return this._profileAction; }

    @Input()
    set profileAction(profileAction: string) {
        this._profileAction = profileAction;
        this.emitTitle();
    }


    @Input()
    set isSidenavProfileOpen(isSidenavProfileOpen) {
        if (!isSidenavProfileOpen && this.editProfileForm) {
            if (this.fileInput) this.fileInput.clear();
            this.buildForm();
        }
    }

    editProfileForm: FormGroup;
    genders = GENDERS;
    compareFn: ((a1: any, a2: any) => boolean) | null = this.compareByViewValue;
    communes = COMMUNNES;

    files: File | FileList;

    @ViewChild(TdFileInputComponent)
    fileInput: TdFileInputComponent;

    isLoading = false;

    constructor(
        private formBuilder: FormBuilder, private userBackendService: UserBackendService,
        private userLoggedService: UserLoggedService, public sanitizer: DomSanitizer,
        private snackbarService: SnackbarService, private userStoreService: UserStoreService
    ) { }

    ngOnInit() {
        this.buildForm();
    }

    emitTitle() {
        this.profileActionTitle = (this.profileAction === 'usuario') ? 'Datos de Usuario' :
            (this.profileAction === 'personal') ? 'Datos Personales' : 'Datos de Contacto';

        this.title.emit(this.profileActionTitle);
    }

    buildForm() {
        this.editProfileForm = this.formBuilder.group({
            id: [this.user.id],
            username: [{ value: this.user.username, disabled: true }],
            //password: [],
            firstName: [this.user.firstName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            lastName: [this.user.lastName, [Validators.required, Validators.pattern(NAME_PATTERN)]],
            dni: [this.user.dni, [noWhitespaceValidator, rutValidator]],
            birthday: [(this.user.birthday != null) ? moment(this.user.birthday, DD_MM_YYYY) : null],
            gender: [this.user.gender],
            avatar: [this.user.avatar],
            mobile: [this.user.mobile, [Validators.pattern(PHONE_PATTERN), Validators.minLength(9), Validators.maxLength(9), noWhitespaceValidator]],
            email: [this.user.email, [Validators.email, noWhitespaceValidator]],
            address: [this.user.address, noWhitespaceValidator],
            commune: [this.user.commune],
            roles: [this.user.roles]
        });

    }

    get username() { return this.editProfileForm.get('username'); }
    get firstName() { return this.editProfileForm.get('firstName'); }
    get lastName() { return this.editProfileForm.get('lastName'); }
    get birthday() { return this.editProfileForm.get('birthday'); }
    get dni() { return this.editProfileForm.get('dni'); }
    get email() { return this.editProfileForm.get('email'); }
    get mobile() { return this.editProfileForm.get('mobile'); }
    get address() { return this.editProfileForm.get('address'); }
    get avatar() { return this.editProfileForm.get('avatar'); }

    selectEventEdit(file: File): void {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.avatar.setValue(new Avatar(
                file.name,
                file.type,
                (reader.result as string).split(',')[1])
            )
        };

        this.avatar.markAsDirty();
    }

    resetAvatar() {
        this.avatar.setValue(this.user.avatar);
        this.avatar.markAsPristine();
    }

    compareByViewValue(a1: any, a2: any): boolean {
        return a1 && a2 && a1 === a2;
    }

    save(): void {
        this.isLoading = true;

        this.editProfileForm.value.username = this.username.value;
        this.editProfileForm.value.birthday = (this.editProfileForm.value.birthday != null) ? moment(this.editProfileForm.value.birthday).format(DD_MM_YYYY) : null;
        this.editProfileForm.value.gender = (this.editProfileForm.value.gender != null) ? this.editProfileForm.value.gender.toUpperCase() : null;
        this.editProfileForm.value.commune = (this.editProfileForm.value.commune != null) ? this.editProfileForm.value.commune.replace(/ /g, '_').toUpperCase() : null;
        this.editProfileForm.value.dni = (this.dni.value === '') ? null : this.dni.value;
        this.editProfileForm.value.mobile = (this.mobile.value === '') ? null : this.mobile.value;
        this.editProfileForm.value.email = (this.email.value === '') ? null : this.email.value;
        this.editProfileForm.value.address = (this.address.value === '') ? null : this.address.value;

        let userEdited: User = this.editProfileForm.value;
        this.userBackendService.updateSecured(userEdited)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe(user => {
                this.userLoggedService.userLoggedNext(user);
                if (this.fileInput) this.fileInput.clear();
                this.editProfileForm.markAsPristine();

                //TODO
                this.userStoreService.updateInManagerDataStore(user);
                this.userStoreService.updateInTeacherDataStore(user);
                this.userStoreService.updateInStudentDataStore(user);

            }, error => {
                if (error instanceof HttpErrorResponse) {
                    this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
                } else {
                    this.snackbarService.openSnackBar(USER_UPDATE_ERROR, RESULT_ERROR);
                }
            }, () => {
                this.snackbarService.openSnackBar(USER_UPDATE_SUCCEED, RESULT_SUCCEED);
            }
            );

    }



}
