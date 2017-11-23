import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Theme } from '../../models/theme';
import { forEach } from '@angular/router/src/utils/collection';


import {OverlayContainer} from '@angular/cdk/overlay';

@Component({
  selector: 'nx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit {

  themes = [

    { name: 'pink-purple', color: '#E91E63', isDark: false },
    { name: 'pink-purple-dark', color: '#E91E63', isDark: true },

    { name: 'indigo-pink', color: '#3F51B5', isDark: false },
    { name: 'indigo-pink-dark', color: '#3F51B5', isDark: true },

    { name: 'orange-blue', color: '#F57C00', isDark: false },
    { name: 'orange-blue-dark', color: '#F57C00', isDark: true },

    { name: 'deeppurple-amber', color: '#673AB7', isDark: false },
    { name: 'deeppurple-amber-dark', color: '#673AB7', isDark: true },

    { name: 'blue-grey', color: '#455A64', isDark: false },
    { name: 'blue-grey-dark', color: '#455A64', isDark: true },

    { name: 'pink-bluegrey', color: '#E91E63', isDark: false },
    { name: 'pink-bluegrey-dark', color: '#E91E63', isDark: true },

  ];

  constructor(public overlayContainer: OverlayContainer) { }

  ngOnInit() {
    this.overlayContainer.getContainerElement().classList.add(this.activeTheme);
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

  installTheme(theme: Theme): void {
    this.overlayContainer.getContainerElement().classList.remove(this.activeTheme);
    localStorage.setItem('theme', JSON.stringify(theme));
    this.overlayContainer.getContainerElement().classList.add(theme.name);
  }

  removeTheme(): void {
    this.overlayContainer.getContainerElement().classList.remove(this.activeTheme);
    localStorage.removeItem('theme');
  }


}
