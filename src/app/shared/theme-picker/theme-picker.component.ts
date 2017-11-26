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
    { name: 'red-indigo', color: '#F44336', isDark: false },
    { name: 'pink-purple', color: '#E91E63', isDark: false },
    { name: 'purple-pink', color: '#9C27B0', isDark: false },
    { name: 'deeppurple-amber', color: '#673AB7', isDark: false },
    { name: 'indigo-pink', color: '#3F51B5', isDark: false },
    { name: 'blue-red', color: '#2196F3', isDark: false },
    { name: 'lightblue-lime', color: '#03A9F4', isDark: false },
    { name: 'cyan-blue-grey', color: '#00BCD4', isDark: false },
    { name: 'teal-yellow', color: '#009688', isDark: false },
    { name: 'green-amber', color: '#4CAF50', isDark: false },
    { name: 'lightgreen-blue', color: '#8BC34A', isDark: false },
    { name: 'lime-pink', color: '#CDDC39', isDark: false },
    { name: 'yellow-deeppurple', color: '#FFEB3B', isDark: false },
    { name: 'amber-indigo', color: '#FFC107', isDark: false },
    { name: 'orange-lightblue', color: '#F57C00', isDark: false },
    { name: 'deeporange-indigo', color: '#FF5722', isDark: false },
    { name: 'brown-orange', color: '#795548', isDark: false },
    { name: 'grey-indigo', color: '#9E9E9E', isDark: false },
    { name: 'bluegrey-amber', color: '#455A64', isDark: false },
  ];

  themesDark = [
    { name: 'red-indigo-dark', color: '#F44336', isDark: true },
    { name: 'pink-purple-dark', color: '#E91E63', isDark: true  },
    { name: 'purple-pink-dark', color: '#9C27B0', isDark: true  },
    { name: 'deeppurple-amber-dark', color: '#673AB7', isDark: true  },
    { name: 'indigo-pink-dark', color: '#3F51B5', isDark: true  },
    { name: 'blue-red-dark', color: '#2196F3', isDark: true  },
    { name: 'lightblue-lime-dark', color: '#03A9F4', isDark: true  },
    { name: 'cyan-blue-grey-dark', color: '#00BCD4', isDark: true  },
    { name: 'teal-yellow-dark', color: '#009688', isDark: true  },
    { name: 'green-amber-dark', color: '#4CAF50', isDark: true  },
    { name: 'lightgreen-blue-dark', color: '#8BC34A', isDark: true  },
    { name: 'lime-pink-dark', color: '#CDDC39', isDark: true  },
    { name: 'yellow-deeppurple-dark', color: '#FFEB3B', isDark: true  },
    { name: 'amber-indigo-dark', color: '#FFC107', isDark: true  },
    { name: 'orange-lightblue-dark', color: '#F57C00', isDark: true  },
    { name: 'deeporange-indigo-dark', color: '#FF5722', isDark: true  },
    { name: 'brown-orange-dark', color: '#795548', isDark: true },
    { name: 'grey-indigo-dark', color: '#9E9E9E', isDark: true},
    { name: 'bluegrey-amber-dark', color: '#455A64', isDark: true },
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
