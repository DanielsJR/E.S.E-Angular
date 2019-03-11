import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/internal/operators/finalize';
import { LocalStorageService } from '../../services/local-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { noWhitespaceValidator } from '../../shared/validators/no-white-space-validator';
import { LOCAL_STORAGE_TOKEN_KEY, RESULT_ERROR } from '../../app.config';


@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  unauthMessage = 'Usuario o Contraseña Incorrecta';
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private localStorageService: LocalStorageService, private snackbarService: SnackbarService,
    private router: Router
  ) { }


  ngOnInit(): void {
    console.log('************LOGIN***************');
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, noWhitespaceValidator]],
      password: ['', [Validators.required, noWhitespaceValidator]]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    this.isLoading = true;

    this.loginService.login(this.username.value, this.password.value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(token => {
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, token.token);
        const endPoint = this.loginService.getPrivilege().toLocaleLowerCase();
        this.router.navigate(['/home/' + endPoint]);
      }, error => {
        console.error('message: ' + error.message + '   status: ' + error.status);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.loginForm.reset();
            this.badCredencialsError();
            this.loginForm.markAsPristine();
            this.snackbarService.openSnackBar('Usuario o Contraseña Incorrecta', RESULT_ERROR);
            this.router.navigate(['/login']);
          } else {
            this.snackbarService.openSnackBar('al Logearse, intente nuevamente', RESULT_ERROR);
            this.router.navigate(['/login']);
        }


        }
      });
  }

  badCredencialsError() {
    this.username.setErrors({ 'bad-credencials': true });
    this.password.setErrors({ 'bad-credencials': true });
  }


}
