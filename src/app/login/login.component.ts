import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCAL_STORAGE_TOKEN_KEY, RESULT_ERROR } from '../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from '../services/local-storage.service';
import { UserLoggedService } from '../services/user-logged.service';
import { noWhitespaceValidator } from '../shared/validators/no-white-space-validator';
import { SnackbarService } from '../services/snackbar.service';
import { finalize } from 'rxjs/internal/operators/finalize';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';



@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;
  unauthMessage = 'Usuario o Contraseña Incorrecta';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder, private loginService: LoginService,
    private userLoggedService: UserLoggedService, private localStorageService: LocalStorageService,
    private snackbarService: SnackbarService, private router: Router
  ) {
    this.user = new User();
  }


  ngOnInit(): void {
    console.log('************LOGIN***************');
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required, noWhitespaceValidator]],
      password: [this.user.password, [Validators.required, noWhitespaceValidator]]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    this.isLoading = true;
    this.user.username = this.username.value;
    this.user.password = this.password.value;
    this.loginService.login(this.user.username, this.user.password)
      .subscribe(token => {
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, token.token);
        const endPoint = this.loginService.getPrivilege().toLocaleLowerCase();
        this.router.navigate(['/home/' + endPoint]);
      }
      )
      , error => {
        console.error(error.message);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 400) {
            this.loginForm.reset();
            this.badCredencialsError();
            this.loginForm.markAsPristine();
          } else if (error.status === 0) {
            this.snackbarService.openSnackBar('Servidor caido', RESULT_ERROR);
          } else {
            this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
          }

        } else {
          this.snackbarService.openSnackBar('Error al logearse, intente nuevamente', RESULT_ERROR);
        }
        this.isLoading = false;
      };
  }

  badCredencialsError() {
    this.username.setErrors({ 'bad-credencials': true });
    this.password.setErrors({ 'bad-credencials': true });
  }


}
