import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LOCAL_STORAGE_TOKEN_ATTRIBUTE } from '../app.config';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'nx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  user: User;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.user = new User();
  }

  onSubmit(): void {
    this.user = this.loginForm.value;
    this.loginService.login(this.user.mobile, this.user.password)
      .subscribe(session => {
        this.localStorageService.setItem(LOCAL_STORAGE_TOKEN_ATTRIBUTE, session);
        this.router.navigate(['/books']);
      }
      );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      mobile: [this.user.mobile, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      password: [this.user.password, Validators.required]
    });
  }


  // getters
  get mobile() { return this.loginForm.get('mobile'); }
  get password() { return this.loginForm.get('password'); }

}
