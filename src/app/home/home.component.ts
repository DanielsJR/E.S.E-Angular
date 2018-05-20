import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { UserBackendService } from '../services/user-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { MatSidenav, MatMenu, MatButton } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';


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
  menuUser = true;

  @ViewChild("sidenavSettings") private sidenavSettings: MatSidenav;
  @ViewChild("settings") private menu: MatMenu;
  @ViewChild("btnSettingsBack") private btnSettingsBack: MatButton;

  constructor(private router: Router, private loginService: LoginService,
    private userBackendService: UserBackendService, private localStorageService: LocalStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer) { }

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
      this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      this.openSnackBar(this.welcome, 'success');
    },
      error => console.error('error getting the token ' + error));
  }

  shortName(user: User): string {
    const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
    const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName;
    return n1 + ' ' + n2;
  }
  rolesToSpanish(roles: string[]): string {
    let rolesSpanish: string[] = [];
    for (let role of roles) {
      if (role === ROLE_ADMIN) {
        role = ROLE_ADMIN_SPANISH;
      }
      if (role === ROLE_MANAGER) {
        role = ROLE_MANAGER_SPANISH;
      }
      if (role === ROLE_TEACHER) {
        role = ROLE_TEACHER_SPANISH;
      }
      if (role === ROLE_STUDENT) {
        role = ROLE_STUDENT_SPANISH;
      };
      rolesSpanish.push(role);
    }
    return rolesSpanish.toString().replace(/,/g, ', ');
  }

  private logout(): void {
    location.reload();//cache clean
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
  }


  openSnackBar(message: string, type: any): void {
    let data = {
      message: message,
      uriRole: 'none',
      type: type
    };

    let snackBarRef = this.snackbarService.openSnackBar(data);
    snackBarRef.afterOpened().subscribe(() => console.log('The snack-bar afterOpened!!!!'));
    snackBarRef.afterDismissed().subscribe(() => console.log('The snack-bar was dismissed!!!'));
    snackBarRef.onAction().subscribe(() => console.log('The snack-bar action was triggered!!!!'));
  }


}
