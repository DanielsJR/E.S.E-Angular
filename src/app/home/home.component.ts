import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { UserBackendService } from '../services/user-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { MatSidenav, MatMenu, MatButton, MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
  privilege = this.loginService.getPrivilege();
  roles = this.loginService.getRoles();

  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  welcome: string;

  scrolled = false;
  triggerUsers = true;
  isTooltipDisabled = false;

  @ViewChild("sidenavSettings") private sidenavSettings: MatSidenav;
  @ViewChild("settings") private menu: MatMenu;
  @ViewChild("btnSettingsBack") private btnSettingsBack: MatButton;

  constructor(private router: Router, private loginService: LoginService,
    private userBackendService: UserBackendService, private localStorageService: LocalStorageService,
    public snackBar: MatSnackBar, public sanitizer: DomSanitizer) { }

  ngAfterViewInit() {
    this.sidenavSettings.openedChange.subscribe(() => {
      this.btnSettingsBack._elementRef.nativeElement.focus();
    });
    this.menu.closed.subscribe(() => {
      // TODO
    });
  }

  ngOnInit() {
    const token = this.localStorageService.getTokenParsed();
    let uriRole;

    if (this.privilege === ROLE_ADMIN) {
      uriRole = URI_ADMINS;
    } else if (this.privilege === ROLE_MANAGER) {
      uriRole = URI_MANAGERS;
    } else if (this.privilege === ROLE_TEACHER) {
      uriRole = URI_TEACHERS;
    } else if (this.privilege === ROLE_STUDENT) {
      uriRole = URI_STUDENTS;
    } else {
      uriRole = "";
      console.error('error no role');
    }
    this.userBackendService.getUserByToken(token, uriRole).subscribe(data => {
      this.user = data;
      this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user): 'Bienvenido ' + this.shortName(this.user);
      this.openSnackBar(this.welcome, 'info');
    },
      error => console.error('error getting the token ' + error));


  }

  shortName(user: User): string {
    const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName; 
    const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName; 
        return n1 + ' ' + n2;
  }


  private logout(): void {
    location.reload();//cache clean
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
