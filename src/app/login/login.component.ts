import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;

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
      .subscribe(session => {
        console.log('setting local storage');
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_KEY, session);
        const route = '/' + this.localStorageService.getRole().toLowerCase();
        this.router.navigate([route]);
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
