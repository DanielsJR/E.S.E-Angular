import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/users.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { LoginService } from '../login/login.service';
import { URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS } from '../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})
export class HomeComponent implements OnInit {

  user: User;
  roles = this.loginService.getRoles();
  privilege = this.loginService.getPrivilege();
  
  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  scrolled = false;  
  triggerUsers = true;

  constructor(private router: Router, private loginService: LoginService,
    private userService: UserService, private localStorageService: LocalStorageService ) { }

  ngOnInit() {
    const token = this.localStorageService.getTokenParsed();
    this.loginService.getPrivilege();
    let uri;
    if (this.loginService.isAdmin) {
      uri = URI_ADMINS;
    } else if (this.loginService.isManager) {
      uri = URI_MANAGERS;
    } else if (this.loginService.isTeacher) {
      uri = URI_TEACHERS;
    } else if (this.loginService.isStudent) {
      uri = URI_STUDENTS;
    } else {
      uri = "";
      error => console.error('error no role');
    }
    this.userService.getUserByToken(token, uri).subscribe(data => {
      this.user = data;
    },
      error => console.error('error getting the token ' + error));
  }


  private logout(): void {
    location.reload();//cache clean
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
  }

}
