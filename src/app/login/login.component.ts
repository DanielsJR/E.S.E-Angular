import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'util';
import { LocalStorageService } from '../services/local-storage.service';
import { TokenAuth } from '../models/token-auth';
import { UserLoggedService } from '../services/user-logged.service';
import { SessionStorageService } from '../services/session-storage.service';



@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;
  unauthMessage = 'Usuario o Contraseña Incorrecta';
  isError = false;
  isAuth = false;

  constructor(
    private formBuilder: FormBuilder, private loginService: LoginService, private userLoggedService: UserLoggedService,
    private localStorageService: LocalStorageService, private sessionStorageService : SessionStorageService, private router: Router) {
    this.user = new User();
  }


  ngOnInit(): void {
    this.buildForm();

  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }


  // getters
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }


  onSubmit2(): void {
    this.user.username = this.username.value;
    this.user.password = this.password.value;
    this.loginService.login(this.user.username, this.user.password).subscribe(user => {
      let tokenAuth = new TokenAuth(user.token, user.roles);
      this.userLoggedService.userLogged(user);

      console.log('setting local storage');
      this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, tokenAuth);
      const uriRol = this.loginService.getPrivilege().toLocaleLowerCase();
      this.router.navigate(['/home/' + uriRol]);
    }, error => {
      console.error(error.message);
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.username.setValue('');
          this.password.setValue('');
          this.loginForm.reset();
          this.isError = true;
        }
      }
    }
    );
  }

  onSubmit(): void {
    this.user.username = this.username.value;
    this.user.password = this.password.value;
    this.loginService.attemptAuth(this.user.username, this.user.password).subscribe(
      data => {
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, data.token);
        const uriRol = this.loginService.getPrivilege().toLocaleLowerCase();
        this.router.navigate(['/home/' + uriRol]);
      }, error => {
        console.error(error.message);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.username.setValue('');
            this.password.setValue('');
            this.loginForm.reset();
            this.isError = true;
          }
        }
      }
    );
  }


}
