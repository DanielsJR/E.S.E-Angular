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



@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;
  unauthMessage = 'Usuario o Contraseña Incorrecta';
  error = false;
  isAuth = false;
  //token: Token;

  constructor(
    private formBuilder: FormBuilder, private loginService: LoginService,
    private localStorageService: LocalStorageService, private router: Router
  ) {
    this.user = new User();
  }

  onSubmit(): void {
    this.user.username = this.userName.value;
    this.user.password = this.password.value;
    this.loginService
      .login(this.user.username, this.user.password)
      .subscribe(tokenAuth => {
        console.log('setting local storage');
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, tokenAuth);
        const uriRol = this.loginService.getPrivilege().toLocaleLowerCase();
        this.router.navigate(['/home/' + uriRol]);
      }, err => {
        console.error(err.message);
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.error(err.message);
            this.userName.setValue('');
            this.password.setValue('');
            this.loginForm.reset();
            this.error = true;
          }
        }
      }
      );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      userName: [this.user.username, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }


  // getters
  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }

}
