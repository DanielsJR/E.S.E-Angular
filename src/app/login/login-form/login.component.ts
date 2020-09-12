import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';
import { noWhitespaceValidator } from '../../shared/validators/no-white-space-validator';
import { RESULT_ERROR, URI_HOME, URI_LOGIN } from '../../app.config';
import { UserLoggedService } from '../../services/user-logged.service';
import { IsLoadingService } from '../../services/isLoadingService.service';


@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  unauthMessage = 'Usuario o Contraseña Incorrecta';

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private userLoggedService: UserLoggedService,
    private localStorageService: LocalStorageService, private snackbarService: SnackbarService,
    private router: Router,
    private isLoadingService: IsLoadingService
  ) { }


  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, noWhitespaceValidator]],
      password: [null, [Validators.required, noWhitespaceValidator]]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  login(): void {
    this.isLoadingService.isLoadingTrue();

    this.loginService.login(this.username.value, this.password.value)
      .subscribe(token => {
        this.localStorageService.setToken(token.token);
        const endPoint = this.userLoggedService.getPrivilege().toLowerCase();
        this.router.navigate([`${URI_HOME}/${endPoint}`]);

      }, err => {
        //console.error('message: ' + err.error.errors + '   status: ' + err.status);
        this.isLoadingService.isLoadingFalse();
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.loginForm.reset();
            this.badCredencialsError();
            this.snackbarService.openSnackBar('Usuario o Contraseña Incorrecta', RESULT_ERROR);
            this.router.navigate([URI_LOGIN]);
          } else {
            this.snackbarService.openSnackBar('Login fallido, intente nuevamente', RESULT_ERROR);
            this.router.navigate([URI_LOGIN]);
          }

        }
      });
  }

  badCredencialsError() {
    this.username.setErrors({ 'bad-credencials': true });
    this.password.setErrors({ 'bad-credencials': true });
  }


}
