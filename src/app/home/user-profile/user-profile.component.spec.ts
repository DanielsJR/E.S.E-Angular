import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { SharedModule } from '../../shared/shared.module';
import { UserStoreService } from '../../services/user-store.service';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserBackendService } from '../../services/user-backend.service';
import { HttpClient } from '@angular/common/http';
import { httpStub } from '../../testing/stubs';
import { HomeModule } from '../home.module';
import { UserLoggedService } from '../../services/user-logged.service';
import { adminTest, httpError401, simpleError } from '../../testing/models';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Title } from '@angular/platform-browser';
import { asyncData, asyncError } from '../../testing/async-helpers';
import { RESULT_SUCCESS, RESULT_ERROR } from '../../app.config';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  let userStoreService: UserStoreService;
  let snackbarService: SnackbarService;
  let userBackendService: UserBackendService;
  let userLoggedService: UserLoggedService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HomeModule, BrowserAnimationsModule],
      providers: [
        { provide: HttpClient, useValue: httpStub },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;

    userLoggedService = TestBed.get(UserLoggedService);
    userStoreService = TestBed.get(UserStoreService);
    userBackendService = TestBed.get(UserBackendService);
    userStoreService = TestBed.get(UserStoreService);
    snackbarService = TestBed.get(SnackbarService);

    component.user = adminTest;
    component.isSidenavProfileOpen = false;
    component.profileAction = 'personal';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit title', () => {
    let title;
    component.title.subscribe(data => title = data);
    component.profileAction = 'contacto';
    expect(title).toEqual('Datos de Contacto');
  });

  it('should validate firstName', () => {
    component.profileAction = 'personal';
    let errors = {};

    component.firstName.setValue('');
    errors = component.firstName.errors || {};
    expect(errors['required']).toBeTruthy('required error');
    expect(component.firstName.valid).toBeFalsy('firstName valid required');

    component.firstName.setValue('admin1');
    errors = component.firstName.errors || {};
    expect(errors['pattern']).toBeTruthy('pattern error');
    expect(component.firstName.valid).toBeFalsy('firstName valid pattern');

    component.firstName.setValue('admin');
    errors = component.firstName.errors || {};
    expect(component.firstName.valid).toBeTruthy('firstName valid');

  });

  it('should validate lastName', () => {
    component.profileAction = 'personal';
    let errors = {};

    component.lastName.setValue('');
    errors = component.lastName.errors || {};
    expect(errors['required']).toBeTruthy('required error');
    expect(component.lastName.valid).toBeFalsy('lastName valid required');

    component.lastName.setValue('admin1');
    errors = component.lastName.errors || {};
    expect(errors['pattern']).toBeTruthy('pattern error');
    expect(component.lastName.valid).toBeFalsy('lastName valid pattern');

    component.lastName.setValue('admin');
    errors = component.lastName.errors || {};
    expect(component.lastName.valid).toBeTruthy('lastName valid');

  });

  it('should validate DNI', () => {
    component.profileAction = 'personal';
    let errors = {};

    component.dni.setValue('  ');
    errors = component.dni.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.dni.valid).toBeFalsy('dni valid noWhitespaceValidator');

    component.dni.setValue('12345-3');
    errors = component.dni.errors || {};
    expect(errors['checkrut']).toBeTruthy('checkrut error');
    expect(component.dni.valid).toBeFalsy('dni valid checkrut');

    component.dni.setValue('14130268-k');
    errors = component.dni.errors || {};
    expect(component.dni.valid).toBeTruthy('dni valid');

  });

  it('should validate mobile', () => {
    component.profileAction = 'contacto';
    let errors = {};

    component.mobile.setValue(' ');
    errors = component.mobile.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.mobile.valid).toBeFalsy('mobile valid noWhitespaceValidator');

    component.mobile.setValue('77765e9');
    errors = component.mobile.errors || {};
    expect(errors['pattern']).toBeTruthy('pattern error');
    expect(component.mobile.valid).toBeFalsy('mobile valid pattern');

    component.mobile.setValue('777666555');
    errors = component.mobile.errors || {};
    expect(component.mobile.valid).toBeTruthy('mobile valid');

  });

  it('should validate mobile', () => {
    component.profileAction = 'contacto';
    let errors = {};

    component.mobile.setValue(' ');
    errors = component.mobile.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.mobile.valid).toBeFalsy('mobile valid noWhitespaceValidator');

    component.mobile.setValue('a77666555');
    errors = component.mobile.errors || {};
    expect(errors['pattern']).toBeTruthy('pattern error');
    expect(component.mobile.valid).toBeFalsy('mobile valid pattern');

    component.mobile.setValue('77766655');
    errors = component.mobile.errors || {};
    expect(errors['minlength']).toBeTruthy('minlength error');
    expect(component.mobile.valid).toBeFalsy('mobile valid minlength');

    component.mobile.setValue('777666555');
    errors = component.mobile.errors || {};
    expect(component.mobile.valid).toBeTruthy('mobile valid');

  });

  it('should validate email', () => {
    component.profileAction = 'contacto';
    let errors = {};

    component.email.setValue(' ');
    errors = component.email.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.email.valid).toBeFalsy('email valid noWhitespaceValidator');

    component.email.setValue('adminemail.com');
    errors = component.email.errors || {};
    expect(errors['email']).toBeTruthy('email error');
    expect(component.email.valid).toBeFalsy('email valid pattern');

    component.email.setValue('admin@email.com');
    errors = component.email.errors || {};
    expect(component.email.valid).toBeTruthy('email valid');

  });

  it('should validate address', () => {
    component.profileAction = 'contacto';
    let errors = {};

    component.address.setValue(' ');
    errors = component.address.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.address.valid).toBeFalsy('address valid noWhitespaceValidator');

    component.address.setValue('los claveles 332');
    errors = component.address.errors || {};
    expect(component.address.valid).toBeTruthy('address valid');

  });

  it('should save', fakeAsync(() => {
    let updateSecuredSpy = spyOn(userBackendService, 'updateSecured').and.returnValue(asyncData(adminTest));
    let userLoggedNextSpy = spyOn(userLoggedService, 'userLoggedNext');
    let updateInManagerDataStoreSpy = spyOn(userStoreService, 'updateInManagerDataStore');
    let updateInTeacherDataStoreSpy = spyOn(userStoreService, 'updateInTeacherDataStore');
    let updateInStudentDataStoreSpy = spyOn(userStoreService, 'updateInStudentDataStore');
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');

    component.save();
    expect(component.isLoading).toBeTruthy();
    tick();
    expect(component.isLoading).toBeFalsy();
    expect(component.editProfileForm.pristine).toBeTruthy();
    expect(userLoggedNextSpy).toHaveBeenCalledWith(adminTest);
    expect(updateInManagerDataStoreSpy).toHaveBeenCalledWith(adminTest);
    expect(updateInTeacherDataStoreSpy).toHaveBeenCalledWith(adminTest);
    expect(updateInStudentDataStoreSpy).toHaveBeenCalledWith(adminTest);
    expect(updateSecuredSpy).toHaveBeenCalledWith(component.editProfileForm.value);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Datos Actualizados', RESULT_SUCCESS);
    expect(openSnackBarSpy).toHaveBeenCalledTimes(1);

  }));

  it('should show error http', fakeAsync(() => {
    let updateSecuredSpy = spyOn(userBackendService, 'updateSecured').and.returnValue(asyncError(httpError401));
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');

    component.save();
    expect(component.isLoading).toBeTruthy();
    tick();
    expect(component.isLoading).toBeFalsy();
    expect(updateSecuredSpy).toHaveBeenCalledWith(component.editProfileForm.value);
    expect(openSnackBarSpy).toHaveBeenCalledWith(httpError401.error.message, RESULT_ERROR);
    expect(openSnackBarSpy).toHaveBeenCalledTimes(1);
  }));

  it('should show error', fakeAsync(() => {
    let updateSecuredSpy = spyOn(userBackendService, 'updateSecured').and.returnValue(asyncError(simpleError));
    let openSnackBarSpy = spyOn(snackbarService, 'openSnackBar');

    component.save();
    expect(component.isLoading).toBeTruthy();
    tick();
    expect(component.isLoading).toBeFalsy();
    expect(updateSecuredSpy).toHaveBeenCalledWith(component.editProfileForm.value);
    expect(openSnackBarSpy).toHaveBeenCalledWith('Error al actualizar usuario', RESULT_ERROR);
    expect(openSnackBarSpy).toHaveBeenCalledTimes(1);
  }));

  it('should compareByViewValue', () => {
    expect(component.compareByViewValue('juan', 'juan')).toBeTruthy();
    expect(component.compareByViewValue('juan', 'lucho')).toBeFalsy();
    expect(component.compareByViewValue('juan', null)).toBeFalsy();
    expect(component.compareByViewValue(null, 'lucho')).toBeFalsy();
    expect(component.compareByViewValue(null, null)).toBeFalsy();
  });

  it('should resetAvatar', () => {
    component.resetAvatar();
    expect(component.avatar.value).toEqual(component.user.avatar);
    expect(component.avatar.pristine).toBeTruthy();

  });

  it('should selectEventEdit', () => {
    component.profileAction = 'usuario';
    let file = new File(['0101'], 'adminPicture.png', { type: 'image/png' });
    component.selectEventEdit(file);
    fixture.detectChanges();
    //expect(component.avatar.value).toEqual('image/png');
    console.log('¨¨¨¨¨¨¨¨component.avatar.value¨¨¨¨¨¨¨¨¨¨¨¨' , component.avatar.value);
    expect(component.avatar.dirty).toBeTruthy('dirty');

  });

});
