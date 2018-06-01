import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { LoginService } from '../login/login.service';
import { URI_ADMINS, URI_MANAGERS, URI_TEACHERS, URI_STUDENTS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, ROLE_ADMIN_SPANISH, ROLE_MANAGER_SPANISH, ROLE_TEACHER_SPANISH, ROLE_STUDENT_SPANISH } from '../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { UserBackendService } from '../services/user-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { MatSidenav, MatMenu, MatButton } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';


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

  isScrolled = false;
  triggerUsers = true;
  isTooltipDisabled = false;
  menuUser = true;

  profileAction = '';

  profileTitle = '';

  private token = this.localStorageService.getTokenParsed();

  private _uriRole: string;

  get uriRole(): string {
    
    if (this.privilege === ROLE_ADMIN) {
      return this._uriRole = URI_ADMINS;
    } else if (this.privilege === ROLE_MANAGER) {
      return this._uriRole = URI_MANAGERS;
    } else if (this.privilege === ROLE_TEACHER) {
      return this._uriRole = URI_TEACHERS;
    } else if (this.privilege === ROLE_STUDENT) {
      return this._uriRole = URI_STUDENTS;
    } else {
      console.error('error no role');
      return this._uriRole = "";

    }
  }


  @ViewChild("sidenavSettings") private sidenavSettings: MatSidenav;
  @ViewChild("settings") private menu: MatMenu;
  @ViewChild("btnSettingsBack") private btnSettingsBack: MatButton;

  constructor(private loginService: LoginService, private userLoggedService: UserLoggedService,
    private router: Router, private userBackendService: UserBackendService,
    private localStorageService: LocalStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer) {

  }

  ngAfterViewInit() {
    this.sidenavSettings.openedChange.subscribe(() => {
      this.btnSettingsBack._elementRef.nativeElement.focus();
    });
    this.menu.closed.subscribe(() => {
      // TODO
    });

  }

  ngOnInit() {
    this.user = this.userLoggedService.user;
    if (this.user) {
      this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      setTimeout(() => this.openSnackBar(this.welcome, 'success'));
    } else {
      console.log('user:null');
      

      this.userBackendService.getUserByToken(this.token, this.uriRole).subscribe(user => {
        this.user = user;
        //this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
        //this.openSnackBar(this.welcome, 'success');
      },
        error => console.error('error getting the token ' + error));
    }

    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
    });
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
  }


}
