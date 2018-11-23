import { Component, OnInit, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { LoginService } from '../login/login.service';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { LocalStorageService } from '../services/local-storage.service';
import { MatSidenav, MatMenu, MatButton } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { Router } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { Subscription } from 'rxjs';
import { RESULT_SUCCESS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../app.config';
import { IsLoadingService } from '../services/isLoadingService.service';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

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

  subscriptionIsLoading: Subscription;
  isLoading: boolean = false;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

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


  constructor(
    private loginService: LoginService, private userLoggedService: UserLoggedService,
    private router: Router, private localStorageService: LocalStorageService,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer, private isLoadingService: IsLoadingService
  ) { }

  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));
    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.user) this.themePicker.getThemeFromServer(this.user.id);
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    });

    if (this.user) {
      this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      setTimeout(() => this.snackbarService.openSnackBar(this.welcome, RESULT_SUCCESS));

    } else {
      console.log('user:null getting user from backend');
      this.userLoggedService.getUserFromBackEnd(this.localStorageService.getTokenUsername(), false)
        .subscribe();
    }


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


  ngOnDestroy() {
    //this.subscriptionIsLoading.unsubscribe();
  }

  shortName(user: User): string {
    return user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
  }

  logout(): void {
    location.reload();//cache clean
    this.loginService.logout();
    this.router.navigate(['/']);
  }



}
