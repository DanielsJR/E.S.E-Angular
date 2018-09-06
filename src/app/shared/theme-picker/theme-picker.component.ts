import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SessionStorageService } from '../../services/session-storage.service';
import { SESSION_STORAGE_THEME_KEY } from '../../app.config';
import { Theme } from './theme';
import { THEMESDARK, THEMESLIGHT } from './themes';
import { LoginService } from '../../login/login.service';
import { ThemeService } from './theme.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { User } from '../../models/user';



@Component({
  selector: 'nx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit {

  themesLight = THEMESLIGHT;
  themesDark = THEMESDARK;
  themeArray: Theme[];

  user: User;

  private defaultTheme: Theme;
  private saveTheme: Theme;
  private installed: boolean;

  constructor(
    public overlayContainer: OverlayContainer, private sessionStorage: SessionStorageService,
    private loginService: LoginService, private themeService: ThemeService, private userLoggedService: UserLoggedService
  ) {

    this.defaultTheme = this.themesLight[4];//new Theme( 'indigo-pink', false, '#3F51B5' );
  }

  ngOnInit() {
    this.installed = false;
    this.overlayContainer.getContainerElement().classList.add(this.themeName);
    this.selectTheme();

    this.userLoggedService.userLogged$.subscribe(user => {
      this.user = user;
    });
  }

  private theme(): Theme {
    if (this.sessionStorage.isStored(SESSION_STORAGE_THEME_KEY))
      return new Theme(this.sessionStorage.getTheme(), this.sessionStorage.isDarkTheme());
  }


  get themeName(): string {
    if (this.theme()) return this.theme().name;
    return this.defaultTheme.name;
  }

  get isDark(): boolean {
    if (this.theme()) return this.theme().isDark;
    return this.defaultTheme.isDark;
  }

  selectTheme(): void {
    (this.isDark) ? this.themeArray = this.themesDark : this.themeArray = this.themesLight;
  }

  installTheme(theme: Theme): void {
    this.overlayContainer.getContainerElement().classList.remove(this.themeName);
    this.sessionStorage.setItem(SESSION_STORAGE_THEME_KEY, theme);
    this.overlayContainer.getContainerElement().classList.add(theme.name);
    this.selectTheme();
    this.installed = true;
    this.sessionStorage.isDarkTheme();

  }

  mouseOverTheme(theme: Theme): void {
    (this.theme()) ? this.saveTheme = this.theme() : this.saveTheme = this.defaultTheme;
    this.installTheme(theme);
    this.installed = false;
  }

  mouseOutTheme(): void {
    if (!this.installed) this.installTheme(this.saveTheme);
  }

  installDarkTheme(): void {
    const darkThemeName = this.themeName + '-dark';
    const darkTheme = new Theme(darkThemeName, true);
    this.installTheme(darkTheme);
    if (this.loginService.hasPrivileges()) this.saveThemeOnServer(this.user.id, darkTheme);
  }

  installLightTheme(): void {
    if (this.themeName !== this.defaultTheme.name) {
      const lightThemeName = this.themeName.slice(0, -5);
      const lightTheme = new Theme(lightThemeName, false);
      this.installTheme(lightTheme);
      if (this.loginService.hasPrivileges()) this.saveThemeOnServer(this.user.id, lightTheme);
    } else {
      this.installDarkTheme();
    }
  }

  removeTheme(): void {
    this.overlayContainer.getContainerElement().classList.remove(this.themeName);
    this.sessionStorage.removeItem(SESSION_STORAGE_THEME_KEY);
    this.installed = false;
  }

  getThemeFromServer(id: string) {
    if (this.loginService.hasPrivileges()) {
      this.themeService.getTheme(id).subscribe(theme => {
        if (theme) {
          this.installTheme(theme);
        }
      }, error => console.error('getThemeFromServer Error!!'));
    }
  }

  saveThemeOnServer(id: string, theme: Theme) {
    if (this.loginService.hasPrivileges()) {
      this.themeService.saveTheme(id, theme).subscribe();
    }

  }

}
