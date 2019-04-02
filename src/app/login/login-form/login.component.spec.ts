import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginModule } from './login.module';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { httpStub } from '../../testing/stubs';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from './login.service';
import { asyncData, asyncError } from '../../testing/async-helpers';
import { Token } from '../../models/token';
import { LocalStorageService } from '../../services/local-storage.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { ROLE_ADMIN, URI_LOGIN, RESULT_ERROR } from '../../app.config';
import { DebugElement } from '@angular/core';
import { newEvent, click } from '../../testing/helper-utilities';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';


let component: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;

let loginServiceSpy: jasmine.SpyObj<LoginService>;
let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
let routerSpy: jasmine.SpyObj<Router>;
let userLoggedServiceSpy: jasmine.SpyObj<UserLoggedService>;
let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

describe('LoginComponent', () => {
  beforeEach(async(() => {

    const lsSpy = jasmine.createSpyObj('LoginService', ['login', 'logout']);
    const lssSpy = jasmine.createSpyObj('LocalStorageService', ['setToken']);
    const rSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    const ulsSpy = jasmine.createSpyObj('UserLoggedService', ['getPrivilege']);
    const sbSpy = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    TestBed.configureTestingModule({
      imports: [LoginModule, NoopAnimationsModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: HttpClient, useValue: httpStub },
        { provide: Router, useValue: rSpy },
        { provide: LoginService, useValue: lsSpy },
        { provide: LocalStorageService, useValue: lssSpy },
        { provide: UserLoggedService, useValue: ulsSpy },
        { provide: SnackbarService, useValue: sbSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    loginServiceSpy = TestBed.get(LoginService);
    localStorageServiceSpy = TestBed.get(LocalStorageService);
    routerSpy = TestBed.get(Router);
    userLoggedServiceSpy = TestBed.get(UserLoggedService);
    snackbarServiceSpy = TestBed.get(SnackbarService);

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should validate username', () => {
    expect(component.username.valid).toBeFalsy();
    let errors = {};
    errors = component.username.errors || {};

    component.username.setValue('');
    expect(errors['required']).toBeTruthy('required error');
    expect(component.username.valid).toBeFalsy('username valid required');

    component.username.setValue('  ');
    errors = component.username.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.username.valid).toBeFalsy('username valid noWhitespaceValidator');

    component.username.setValue('admin');
    errors = component.username.errors || {};
    expect(component.username.valid).toBeTruthy('username valid');

  });

  it('should validate password', () => {
    expect(component.password.valid).toBeFalsy();
    let errors = {};
    errors = component.password.errors || {};

    component.password.setValue('');
    expect(errors['required']).toBeTruthy('required error');
    expect(component.password.valid).toBeFalsy('password valid required');

    component.password.setValue('  ');
    errors = component.password.errors || {};
    expect(errors['whitespace']).toBeTruthy('noWhitespaceValidator error');
    expect(component.password.valid).toBeFalsy('password valid noWhitespaceValidator');

    component.password.setValue('admin');
    errors = component.password.errors || {};
    expect(component.password.valid).toBeTruthy('password valid');

  });

  it('should login', fakeAsync(() => {

    const testToken: Token = { token: 'TestToken' };
    loginServiceSpy.login.and.returnValue(asyncData(testToken));
    userLoggedServiceSpy.getPrivilege.and.returnValue(ROLE_ADMIN);

    const inputs: HTMLInputElement[] = fixture.nativeElement.querySelectorAll('input');//
    const name = inputs[0];
    const pass = inputs[1];
    const btnSend: HTMLButtonElement = fixture.nativeElement.querySelector('button[type=submit]');
    const form = fixture.debugElement.query(By.css('form'));

    expect(component.loginForm.invalid).toBeTruthy('form invalid');
    expect(btnSend.disabled).toBeTruthy('btn disabled');

    expect(component.username.valid).toBeFalsy();
    name.value = 'admin';
    name.dispatchEvent(newEvent('input'));
    expect(component.username.value).toEqual('admin');
    expect(component.username.valid).toBeTruthy('username valid');

    expect(component.loginForm.invalid).toBeTruthy('form invalid');
    expect(btnSend.disabled).toBeTruthy('btn disabled');

    expect(component.password.valid).toBeFalsy();
    pass.value = 'admin';
    pass.dispatchEvent(newEvent('input'));
    expect(component.password.value).toEqual('admin');
    expect(component.password.valid).toBeTruthy('pass valid');

    expect(component.loginForm.invalid).toBeFalsy('form valid');
    fixture.detectChanges();
    expect(btnSend.disabled).toBeFalsy('btn enabled');

    btnSend.click();
    //form.triggerEventHandler('ngSubmit', null);
    //component.login();

    expect(component.isLoading).toBeTruthy('is loading');
    tick();
    expect(component.isLoading).toBeFalsy('is not loading');
    expect(localStorageServiceSpy.setToken).toHaveBeenCalledWith(testToken.token);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/' + ROLE_ADMIN.toLowerCase()]);

    // args passed to router.navigateByUrl() spy
    const spy = routerSpy.navigate as jasmine.Spy;
    const navArgs: string = spy.calls.first().args[0][0];
    expect(navArgs).toBe('/home/' + ROLE_ADMIN.toLowerCase());


  }));

  it('should show http error 401', fakeAsync(() => {

    const errorResponse = new HttpErrorResponse({
      error: 'test 401 error',
      status: 401, statusText: 'Not Found'
    });
    loginServiceSpy.login.and.returnValue(asyncError(errorResponse));

    component.username.setValue('admin');
    component.password.setValue('admin');
    component.login();

    expect(component.isLoading).toBeTruthy('is loading');
    tick();
    expect(component.isLoading).toBeFalsy('is not loading');

    expect(component.username.value).toEqual(null,'username empty');
    expect(component.password.value).toEqual(null, 'password empty');

    let usernameErrors = {};
    usernameErrors = component.username.errors || {};
    expect(usernameErrors['bad-credencials']).toBeTruthy('bad-credencials error');
    expect(component.username.valid).toBeFalsy('bad-credencials');

    let passErrors = {};
    passErrors = component.password.errors || {};
    expect(passErrors['bad-credencials']).toBeTruthy('bad-credencials error');
    expect(component.password.valid).toBeFalsy('bad-credencials');

    expect(component.loginForm.pristine).toBeTruthy('loginForm.pristine');

    expect(snackbarServiceSpy.openSnackBar).toHaveBeenCalledWith('Usuario o Contraseña Incorrecta', RESULT_ERROR);

    expect(routerSpy.navigate.calls.first().args[0][0]).toBe(URI_LOGIN);

  }));

  it('should show http error', fakeAsync(() => {

    const errorResponse = new HttpErrorResponse({
      error: 'test 500 error',
      status: 500, statusText: 'Not Found'
    });
    loginServiceSpy.login.and.returnValue(asyncError(errorResponse));

    component.username.setValue('admin');
    component.password.setValue('admin');
    component.login();

    expect(component.isLoading).toBeTruthy('is loading');
    tick();
    expect(component.isLoading).toBeFalsy('is not loading');

    expect(component.username.value).toEqual('admin');
    expect(component.password.value).toEqual('admin');

    expect(snackbarServiceSpy.openSnackBar).toHaveBeenCalledWith('al Logearse, intente nuevamente', RESULT_ERROR);

    expect(routerSpy.navigate.calls.first().args[0][0]).toBe(URI_LOGIN);

  }));

});


