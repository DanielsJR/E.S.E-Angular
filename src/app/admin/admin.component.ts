import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../shared/theme-picker.scss'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],

  encapsulation: ViewEncapsulation.None,


})
export class AdminComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;
  triggerPruebas = true;

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

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

  }

  private logout(): void {
    this.loginService.logout();
    localStorage.removeItem('theme');
    this.router.navigate(['/']);
  }


  // **********Material Themes***************\\
  get activeTheme(): string {
    return localStorage.getItem('theme');
  }
  installTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }
  // **********Material Themes***************\\






}
