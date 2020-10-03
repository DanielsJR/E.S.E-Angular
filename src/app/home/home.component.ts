import { Component, OnInit, ViewChild, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { tdRotateAnimation, tdCollapseAnimation, tdBounceAnimation, tdHeadshakeAnimation } from '@covalent/core/common';
import { SnackbarService } from '../shared/snackbars-ref/snackbar.service';
import { Router, ActivatedRoute, ActivationEnd, } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_WELCOME, WELCOME_ADMIN, RESULT_SUCCEED, WELCOME_FEMALE, WELCOME_MALE, TITLE_PROFILE, TITLE_PREFERENCES } from '../app.config';
import { IsLoadingService } from '../services/isLoadingService.service';
import { Theme } from '../shared/theme-picker/theme';
import { LoginService } from '../login/login-form/login.service';

import { MatSidenav, MatDrawer } from '@angular/material/sidenav';
import { delay } from 'rxjs/internal/operators/delay';
import { QuizNotificationService } from '../services/quiz-notification.service';
import { onMainContentChangeLeft, onMainContentChangeRight, animateText, onSideNavChange, routeAnimations, rowAnimation, waitAnimation, logoNavChange, } from '../shared/animations/animations';
import { Subscription, Observable, of } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { CanComponentDeactivate } from '../guards/can-deactivate-guard.service';
import { MultiDatePickerService } from '../shared/multi-date-picker/multy-date-picker.service';
import { HomeUserService } from './home-user/home-user.service';
import { GENDERS } from '../models/genders';



@Component({
  selector: 'nx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    tdRotateAnimation,
    tdCollapseAnimation,

    onMainContentChangeLeft,
    onMainContentChangeRight,
    onSideNavChange,
    animateText,

    tdBounceAnimation,
    tdHeadshakeAnimation,
    routeAnimations,
    logoNavChange,
  ],
})
export class HomeComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  user: User;
  privilege = this.userLoggedService.getPrivilege();
  roles = this.userLoggedService.getRoles();
  uriRole = this.userLoggedService.getUriRole();

  @ViewChild("themePicker") themePicker: ThemePickerComponent;

  welcome: string;

  isScrolled = false;
  isLoading: boolean = false;

  profileAction = '';
  profileTitle = '';
  _isSidenavProfileOpen = new EventEmitter<boolean>();
  isSidenavProfileOpen: boolean = false;
  @ViewChild("sidenavProfile") sidenavProfile: MatSidenav;

  sideNavMenuState: boolean;
  sideNavChatState: boolean;
  @ViewChild("sidenavMenu") sidenavMenu: MatSidenav;
  @ViewChild("sidenavChat") sidenavChat: MatSidenav;

  @ViewChild("sidenavMenuProfile") sidenavMenuProfile: MatDrawer;
  @ViewChild("sidenavMenuSettings") sidenavMenuSettings: MatDrawer;

  animString: String;

  currentYear: Date = new Date();
  year: Date;

  headshakeState = false;
  fillToolbar = false;

  private subscriptions = new Subscription();

  constructor(
    private loginService: LoginService,
    private userLoggedService: UserLoggedService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
    //private quizNotificationService: QuizNotificationService,
    private cdRef: ChangeDetectorRef, private multiDatePickerService: MultiDatePickerService,
    private homeUserService: HomeUserService,

  ) {
    this.subscriptions.add(this.isLoadingService.isLoading$.subscribe(result => this.isLoading = result));

    this.subscriptions.add(this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    }));

    this.getState();

    this.multiDatePickerService.date$.subscribe(date => this.year = date);
  }

  ngOnInit() {
    if (this.user) {
      if (this.userLoggedService.isAdmin()) this.welcome = WELCOME_ADMIN + this.shortName(this.user);
      else this.welcome = (this.user.gender === GENDERS[1].viewValue) ? WELCOME_FEMALE + this.shortName(this.user) : WELCOME_MALE + this.shortName(this.user);
    }

  }

  ngAfterViewInit() {
    this.subscriptions.add(this.route.data
      .subscribe((t: { theme: Theme }) => {
        if (t.theme) {
          this.themePicker.installTheme(t.theme);
        }
        if (this.userLoggedService.redirectUrl && (this.userLoggedService.redirectUser === this.user.username)) {
          this.router.navigate([this.userLoggedService.redirectUrl]);
        }

        setTimeout(() => {
          this.sidenavMenu.open();
          this.sidenavChat.open();
          this.sideNavMenuState = false;
          this.sideNavChatState = false;
          this.snackbarService.openSnackBar(this.welcome, RESULT_SUCCEED);
        }, 1000);

      }));

    this.subscriptions.add(this.sidenavProfile.openedChange.subscribe(isOpen => {
      // this.btnProfileBack._elementRef.nativeElement.focus();
      this._isSidenavProfileOpen.emit(this.isSidenavProfileOpen = isOpen);
    }));

    this.subscriptions.add(this.homeUserService.menuAction$.subscribe(action => {
      if (action.length) {
        if (action === TITLE_PROFILE && !this.sidenavMenuSettings.opened) this.toggleSideNavAsyc(this.sidenavMenuProfile);
        else if (action === TITLE_PREFERENCES && !this.sidenavMenuProfile.opened) this.toggleSideNavAsyc(this.sidenavMenuSettings);
      }

    }));

    this.cdRef.detectChanges();

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  shortName(user: User): string {
    return user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
  }

  logout(): void {
    this.router.navigate([URI_WELCOME]).then(() => {
      setTimeout(() => {
        this.loginService.logout()
        setTimeout(() => window.location.reload(true), 1000);
      }, 1000);

    });
    //this.quizNotificationService.setQuizSent(true);
  }

  getState() {
    this.subscriptions.add(this.router.events.pipe(
      filter(event => event instanceof ActivationEnd && event.snapshot.children.length == 0))
      .subscribe((event: ActivationEnd) => {
        if (event.snapshot.parent.url.toString() === 'subjects,detail') this.animString = event.snapshot.parent.data.animation;
        else this.animString = event.snapshot.data.animation;
      }));
  }

  closeAllSidenav(): boolean {
    this.sideNavMenuState = false;
    this.sidenavMenu.close();
    this.sidenavChat.close();
    return (!this.sidenavMenu.opened && !this.sidenavChat.opened);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return of(this.closeAllSidenav()).pipe(delay(300));
  }

  wasSideNavOpenAsyc: boolean = false;
  toggleSideNavAsyc(sidenav: MatDrawer | MatSidenav) {
    if (!this.sideNavMenuState) {
      this.sideNavMenuState = true;
      setTimeout(() => sidenav.toggle(), 500);
      this.wasSideNavOpenAsyc = true;
    } else if (this.sideNavMenuState && this.wasSideNavOpenAsyc) {
      sidenav.toggle();
      setTimeout(() => this.sideNavMenuState = false, 500);
      this.wasSideNavOpenAsyc = false;
    } else {
      sidenav.toggle();
    }

  }


}
