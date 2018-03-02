import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';
import { LocalStorageService } from '../shared/services/local-storage.service';

import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'util';


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

  constructor(
    private formBuilder: FormBuilder, private loginService: LoginService,
    private localStorageService: LocalStorageService, private router: Router
  ) {
    this.user = new User();
  }

  onSubmit(): void {
    this.user.userName = this.userName.value;
    this.user.password = this.password.value;
    this.loginService
      .login(this.user.userName, this.user.password)
      .subscribe(session => {
        console.log('setting local storage');
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, session);
        let role = this.localStorageService.getRole();
        if (role === 'ADMIN') { role = 'admin' }
        if (role === 'ADMINISTRADOR') { role = 'manager' }
        if (role === 'PROFESOR') { role = 'teacher' }
        if (role === 'ESTUDIANTE') { role = 'student' }
        const route = '/' + role;
        this.router.navigate([route]);
      }, err => {
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
      userName: [this.user.userName, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }


  // getters
  get userName() { return this.loginForm.get('userName'); }
  get password() { return this.loginForm.get('password'); }

}
