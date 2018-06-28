import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { LoginService } from '../login/login.service';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { UserBackendService } from '../services/user-backend.service';
import { LocalStorageService } from '../services/local-storage.service';
import { MatSidenav, MatMenu, MatButton } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { ROLE_ADMIN, URI_ADMINS, ROLE_MANAGER, URI_MANAGERS, ROLE_TEACHER, URI_TEACHERS, ROLE_STUDENT, URI_STUDENTS, LOCAL_STORAGE_TOKEN_KEY } from '../app.config';


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
  uriRole = this.loginService.uriRole;

  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  welcome: string;

  isScrolled = false;
  triggerUsers = true;
  menuUser = true;

  //profile
  profileAction = '';
  profileTitle = '';
  _isSidenavProfileOpen = new EventEmitter<boolean>();
  isSidenavProfileOpen: boolean = false;
  @ViewChild("sidenavMenuProfile") private sidenavMenuProfile: MatSidenav;
  @ViewChild("btnMenuProfileBack") private btnMenuProfileBack: MatButton;
  @ViewChild("sidenavProfile") private sidenavProfile: MatSidenav;
  @ViewChild("btnProfileBack") private btnProfileBack: MatButton;

  //settings
  @ViewChild("sidenavSettings") private sidenavSettings: MatSidenav;
  @ViewChild("settings") private menu: MatMenu;
  @ViewChild("btnSettingsBack") private btnSettingsBack: MatButton;


  constructor(private loginService: LoginService, private userLoggedService: UserLoggedService,
    private router: Router, private userBackendService: UserBackendService,
    private localStorageService: LocalStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer) {

  }

  ngAfterViewInit() {
    this.sidenavMenuProfile.openedChange.subscribe(() => {
      //this.btnMenuProfileBack._elementRef.nativeElement.focus();

    });
    this.menu.closed.subscribe(() => {
      // TODO
    });

    this.sidenavProfile.openedChange.subscribe(isOpen => {
      // this.btnProfileBack._elementRef.nativeElement.focus();
      this._isSidenavProfileOpen.emit(this.isSidenavProfileOpen = isOpen);
    });


  }

  ngOnInit() {
    this.user = this.userLoggedService.user;
    if (this.user) {
      this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      setTimeout(() => this.openSnackBar(this.welcome, 'success'));
    } else {
      console.log('user:null getting user from userLoggedService');
      this.userLoggedService.getUserFromBackEnd(this.localStorageService.getTokenUsername(),false);
    }

    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    });
  }

  shortName(user: User): string {
    const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
    const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName;
    return n1 + ' ' + n2;
  }

  logout(): void {
    location.reload();//cache clean
    this.loginService.logout();
    //this.themePicker.removeTheme();
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
