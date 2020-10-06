import { Component, OnInit, Input } from '@angular/core';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../app.config';
import { animateText } from '../../shared/animations/animations';

@Component({
  selector: 'nx-home-menu',
  template: `

<mat-list-item *ngIf="roles?.includes(roleAdmin)" routerLink="./admin" routerLinkActive="active" #rla="routerLinkActive" [routerLinkActiveOptions]= "{exact: true}">
  <mat-icon matListIcon svgIcon="home-variant" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Home</h3>
</mat-list-item>  
  
<mat-list-item *ngIf="roles?.includes(roleManager)  && !roles?.includes(roleAdmin)" routerLink="./manager" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]= "{exact: true}">
  <mat-icon matListIcon svgIcon="home-variant"  [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Home</h3>
</mat-list-item>  

<mat-list-item *ngIf="roles?.includes(roleTeacher)  && !roles?.includes(roleAdmin) && !roles?.includes(roleManager)" routerLink="./teacher" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]= "{exact: true}">
  <mat-icon matListIcon svgIcon="home-variant" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Home</h3>
</mat-list-item>

<mat-list-item *ngIf="roles?.includes(roleStudent)" routerLink="./student" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]= "{exact: true}">
  <mat-icon matListIcon svgIcon="home-variant" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Home</h3>
</mat-list-item>

<mat-divider></mat-divider>

  
  `,
  styles: [
  ],
  animations: [
    animateText,
  ]


})

export class HomeMenuComponent implements OnInit {

  @Input() roles: string[];

  @Input() sideNavMenuState: string;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;


  constructor() { }

  ngOnInit() {
  }

}
