import { Component, OnInit, ViewChild, EventEmitter, OnDestroy } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { tdRotateAnimation, tdCollapseAnimation } from '@covalent/core/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_WELCOME, WELCOME_ADMIN, RESULT_SUCCEED } from '../app.config';
import { IsLoadingService } from '../services/isLoadingService.service';
import { Theme } from '../shared/theme-picker/theme';
import { LoginService } from '../login/login-form/login.service';
import { QuizNotificationService } from '../services/quiz-notification.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { delay } from 'rxjs/internal/operators/delay';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    tdRotateAnimation,
    tdCollapseAnimation,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

  user: User;
  privilege = this.userLoggedService.getPrivilege();
  roles = this.userLoggedService.getRoles();
  uriRole = this.userLoggedService.getUriRole();

  @ViewChild("themePicker") themePicker: ThemePickerComponent;

  welcome: string;

  isScrolled = false;
  triggerUsers = true;
  menuUser = true;
  isLoading: boolean = false;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  btnRoute = false;

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

  currentUrl: string = '';


  constructor(
    private loginService: LoginService, private userLoggedService: UserLoggedService,
    private router: Router, private route: ActivatedRoute,
    private snackbarService: SnackbarService, public sanitizer: DomSanitizer,
    private isLoadingService: IsLoadingService, private quizNotificationService: QuizNotificationService,
  ) {

    this.isLoadingService.isLoading$.subscribe(result => setTimeout(() => this.isLoading = result));
    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    });


  }

  ngOnInit() {

    this.route.data
    .pipe(delay(0))
    .subscribe((data: { theme: Theme }) => {
      if (data.theme) {
        console.log('NAMEEE ', data.theme.name);
        this.themePicker.installTheme(data.theme);
      }
      if (this.userLoggedService.redirectUrl && (this.userLoggedService.getTokenUsername() === this.user.username))
        this.router.navigate([this.userLoggedService.redirectUrl]);
    });

    if (this.user) {
      if (this.user.username === '111') {
        this.welcome = WELCOME_ADMIN + this.shortName(this.user);
      } else {
        this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      }

      setTimeout(() => this.snackbarService.openSnackBar(this.welcome, RESULT_SUCCEED));

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
    this.quizNotificationService.setQuizSent(true);
    this.loginService.logout();
    this.router.navigate([URI_WELCOME]).then(() => {
      window.location.reload(true);//cache clean
    });

  }



}
