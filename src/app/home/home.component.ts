import { Component, OnInit, ViewChild, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { tdRotateAnimation, tdCollapseAnimation, tdBounceAnimation, tdPulseAnimation } from '@covalent/core/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from '../services/snackbar.service';
import { Router, ActivatedRoute, NavigationStart, RouterOutlet, NavigationEnd, ActivationEnd, ActivationStart, ChildActivationEnd } from '@angular/router';
import { UserLoggedService } from '../services/user-logged.service';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT, URI_WELCOME, WELCOME_ADMIN, RESULT_SUCCEED } from '../app.config';
import { IsLoadingService } from '../services/isLoadingService.service';
import { Theme } from '../shared/theme-picker/theme';
import { LoginService } from '../login/login-form/login.service';

import { MatSidenav, MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatButton } from '@angular/material/button';
import { MatMenu } from '@angular/material/menu';
import { delay } from 'rxjs/internal/operators/delay';
import { QuizNotificationService } from '../services/quiz-notification.service';
import { onMainContentChangeLeft, onMainContentChangeRight, animateText, onSideNavChange, onLogoChange, routeAnimations, rowAnimation, waitAnimation, } from '../shared/animations/animations';
import { Subscription, Observable, of } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { CanComponentDeactivate } from '../guards/can-deactivate-guard.service';
import { switchMap } from 'rxjs/operators';


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

    onLogoChange,
    tdBounceAnimation,
    routeAnimations,
  ],
})
export class HomeComponent implements OnInit, OnDestroy, CanComponentDeactivate {

  user: User;
  privilege = this.userLoggedService.getPrivilege();
  roles = this.userLoggedService.getRoles();
  uriRole = this.userLoggedService.getUriRole();

  @ViewChild("themePicker") themePicker: ThemePickerComponent;

  welcome: string;

  isScrolled = false;
  triggerUsers = true;
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
  @ViewChild("sidenavProfile") sidenavProfile: MatSidenav;


  currentUrl: string = '';

  sideNavMenuState: boolean;
  sideNavChatState: boolean;
  @ViewChild("sidenavMenu") sidenavMenu: MatSidenav;
  @ViewChild("sidenavChat") sidenavChat: MatSidenav;

  private subscriptions = new Subscription();

  animString: String;

  constructor(
    private loginService: LoginService,
    private userLoggedService: UserLoggedService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    public sanitizer: DomSanitizer,
    private isLoadingService: IsLoadingService,
    //private quizNotificationService: QuizNotificationService,
    private cdRef: ChangeDetectorRef,

  ) {

    this.subscriptions.add(this.isLoadingService.isLoading$.subscribe(result =>
      this.isLoading = result
    ));

    this.subscriptions.add(this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
      if (this.isSidenavProfileOpen) this.sidenavProfile.close();
    }));

    this.getState();

  }

  ngOnInit() {
    if (this.user) {
      if (this.user.username === '111') {
        this.welcome = WELCOME_ADMIN + this.shortName(this.user);
      } else {
        this.welcome = (this.user.gender === 'Mujer') ? 'Bienvenida ' + this.shortName(this.user) : 'Bienvenido ' + this.shortName(this.user);
      }

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
          this.sideNavMenuState = true;
          this.sideNavChatState = false;
          this.snackbarService.openSnackBar(this.welcome, RESULT_SUCCEED);
        }, 1000);

      }));

    this.subscriptions.add(this.sidenavProfile.openedChange.subscribe(isOpen => {
      // this.btnProfileBack._elementRef.nativeElement.focus();
      this._isSidenavProfileOpen.emit(this.isSidenavProfileOpen = isOpen);
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
        if (event.snapshot.parent.url.toString() === 'subjects,detail') {
          this.animString = event.snapshot.parent.data.animation;
        } else {
          this.animString = event.snapshot.data.animation;
        }
      }));
  }

  closeAllSidenav(): boolean {
    this.sidenavMenu.close();
    this.sidenavChat.close();
    return (!this.sidenavMenu.opened && !this.sidenavChat.opened);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return of(this.closeAllSidenav()).pipe(delay(300));
  }
}
