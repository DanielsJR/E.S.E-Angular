
import { LoginService } from '../../login/login.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'nx-admin-create-user',
  templateUrl: './admin-create-user.component.html',
  styleUrls: ['./admin-create-user.component.css']
})
export class AdminCreateUserComponent implements OnInit {

  user: User;
  crateManagerForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder, private loginService: LoginService,
    private router: Router
  ) {
    this.user = new User();
  }

  ngOnInit(): void {
    this.buildForm();

  }


  buildForm(): void {
    this.crateManagerForm = this.formBuilder.group({
      userName: [this.user.username, Validators.required],
      phone: [this.user.mobile, Validators.required],
      password: [this.user.password, Validators.required]
    });
  }


  // getters
  get userName() { return this.crateManagerForm.get('userName'); }
  get phone() { return this.crateManagerForm.get('phone'); }
  get password() { return this.crateManagerForm.get('password'); }

  onSubmit(): void {
    this.user.username = this.userName.value;
    this.user.mobile = this.phone.value;
    this.user.password = this.password.value;

    this.router.navigate(['/admin']);
  }






}
