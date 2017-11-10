import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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

 get activeTheme(): string {
    return localStorage.getItem('theme');
  }

  installTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  removeTheme(theme: string): void {
    localStorage.removeItem('theme');
  }

}
