import { Component, OnInit } from '@angular/core';
import { Theme } from '../shared/theme-picker/theme';


@Component({
  selector: 'nx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  initialTheme: Theme;
  constructor() { }

  ngOnInit() {
    this.initialTheme = { name: 'lightblue-lime-dark', color: '#03A9F4', isDark: true };
  }

  get year() {
    return new Date().getFullYear();
  }

}
