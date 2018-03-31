import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/users.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  scrolled = false;
  role = this.localStorage.getRolesParsed();

  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  constructor(private router: Router, private loginService: LoginService,
    private service: UserService, private localStorage: LocalStorageService
    
  ) { }

  ngOnInit() {
  }

  private logout(): void {
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
    
  }

}
