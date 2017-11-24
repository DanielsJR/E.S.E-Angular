import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Theme } from '../../models/theme';
import { forEach } from '@angular/router/src/utils/collection';


import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'nx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit {

  themesLight = [
    { name: 'pink-purple', color: '#E91E63', isDark: false },
    { name: 'indigo-pink', color: '#3F51B5', isDark: false },
    { name: 'orange-blue', color: '#F57C00', isDark: false },
    { name: 'deeppurple-amber', color: '#673AB7', isDark: false },
    { name: 'blue-grey', color: '#455A64', isDark: false },
    { name: 'pink-bluegrey', color: '#E91E63', isDark: false },
  ];

  themesDark = [
    { name: 'pink-purple-dark', color: '#E91E63', isDark: true },
    { name: 'indigo-pink-dark', color: '#3F51B5', isDark: true },
    { name: 'orange-blue-dark', color: '#F57C00', isDark: true },
    { name: 'deeppurple-amber-dark', color: '#673AB7', isDark: true },
    { name: 'blue-grey-dark', color: '#455A64', isDark: true },
    { name: 'pink-bluegrey-dark', color: '#E91E63', isDark: true },
  ];

  themeArray;

  constructor(public overlayContainer: OverlayContainer) { }

  ngOnInit() {
    this.overlayContainer.getContainerElement().classList.add(this.activeTheme);
    this.selectTheme();
  }

  private theme(): Theme {
    if (localStorage.length !== 0) {
      const stringTheme = localStorage.getItem('theme');
      const parsedTheme: any = JSON.parse(stringTheme);
      return new Theme(parsedTheme.name, parsedTheme.isDark);
    } else {
      return null;
    }
  }

  get activeTheme(): string {
    if (this.theme() != null) {
      return this.theme().name;
    } else {
      return 'indigo-pink';
    }
  }

  get isDark(): boolean {
    if (this.theme() != null) {
      return this.theme().isDark;
    } else {
      return false;
    }
  }

  selectTheme(): void {
    if (this.isDark) {
      this.themeArray = this.themesDark;
    }else {
      this.themeArray = this.themesLight;
    }
  }

  installTheme(theme: Theme): void {
    this.overlayContainer.getContainerElement().classList.remove(this.activeTheme);
    localStorage.setItem('theme', JSON.stringify(theme));
    this.overlayContainer.getContainerElement().classList.add(theme.name);
    this.selectTheme();
  }

  installDarkTheme(): void {
    const darkThemeName = this.activeTheme + '-dark';
    const darkTheme = new Theme(darkThemeName, true);
    this.installTheme(darkTheme);
  }

  installLightTheme(): void {
    if (this.activeTheme !== 'indigo-pink') {
      const lightThemeName = this.activeTheme.slice(0, -5);
      const lightTheme = new Theme(lightThemeName, false);
      this.installTheme(lightTheme);
    } else {
      this.installDarkTheme();
    }
  }

  removeTheme(): void {
    this.overlayContainer.getContainerElement().classList.remove(this.activeTheme);
    localStorage.removeItem('theme');
  }


}
