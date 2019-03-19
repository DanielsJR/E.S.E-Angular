import { Component, OnInit, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { MatSidenav, MatMenu, MatButton } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { RESULT_SUCCESS, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../app.config';
import { IsLoadingService } from '../services/isLoadingService.service';
import { Theme } from '../shared/theme-picker/theme';
import { LoginService } from '../login/login-form/login.service';


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
  privilege = this.userLoggedService.getPrivilege();
  roles = this.userLoggedService.getRoles();
  uriRole = this.userLoggedService.getUriRole();

  @ViewChild(ThemePickerComponent) themePicker: ThemePickerComponent;

  welcome: string;

  isScrolled = false;
  triggerUsers = true;
  menuUser = true;
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
  @ViewChild("sidenavMenuProfile") sidenavMenuProfile: MatSidenav;
  @ViewChild("btnMenuProfileBack") btnMenuProfileBack: MatButton;
  @ViewChild("sidenavProfile") sidenavProfile: MatSidenav;
  @ViewChild("btnProfileBack") btnProfileBack: MatButton;

  //settings
  @ViewChild("sidenavSettings") sidenavSettings: MatSidenav;
  @ViewChild("settings") menu: MatMenu;
  @ViewChild("btnSettingsBack") btnSettingsBack: MatButton;

  constructor(
    private loginService: LoginService, private userLoggedService: UserLoggedService,
    private router: Router, private route: ActivatedRoute,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer,
    private isLoadingService: IsLoadingService,
   
  ) { }

  ngOnInit() {
    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));
    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    }
    );

    this.route.data
      .subscribe((data: { theme: Theme }) => {
        if (data.theme) this.themePicker.installTheme(data.theme);
        if (this.userLoggedService.redirectUrl && (this.userLoggedService.getTokenUsername() === this.user.username))
          this.router.navigate([this.userLoggedService.redirectUrl]);
      });



    if (this.user) {
      if (this.user.username === '111') {
        this.welcome = 'Bienvenido Sr. ' + this.shortName(this.user);
      } else {
        this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      }

      setTimeout(() => this.snackbarService.openSnackBar(this.welcome, RESULT_SUCCESS));

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
