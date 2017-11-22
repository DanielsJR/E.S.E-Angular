import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Theme } from '../../models/theme';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'nx-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit {

  themes = [

    {
      name: 'deeppurple-amber',
      color: '#673AB7',
      isDark: false,
    },
    {
      name: 'orange-blue',
      color: '#F57C00',
      isDark: false,
    },
    {
      name: 'indigo-pink',
      color: '#3F51B5',
      isDark: false,
    },
    {
      name: 'pink-bluegrey',
      color: '#E91E63',
      isDark: true,
    },
    {
      name: 'blue-grey',
      color: '#455A64',
      isDark: true,
    },
    {
      name: 'purple-green',
      color: '#7B1FA2',
      isDark: true,
    }
  ];

  constructor() { }

  ngOnInit() {

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
    localStorage.setItem('theme', JSON.stringify(theme));
  }

  removeTheme(theme: string): void {
    localStorage.removeItem('theme');
  }


}
