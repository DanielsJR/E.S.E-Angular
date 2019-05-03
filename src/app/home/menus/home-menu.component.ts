import { Component, OnInit, Input } from '@angular/core';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../app.config';

@Component({
  selector: 'nx-home-menu',
  template: `

<mat-list-item *ngIf="roles?.includes(roleAdmin)" routerLink="./admin">
  <mat-icon matListIcon svgIcon="home-variant"></mat-icon>
    <h3 matLine>Home</h3>
</mat-list-item>  
  
<mat-list-item *ngIf="roles?.includes(roleManager)  && !roles?.includes(roleAdmin)" routerLink="./manager">
  <mat-icon matListIcon svgIcon="home-variant"></mat-icon>
    <h3 matLine>Home</h3>
</mat-list-item>  

<mat-list-item *ngIf="roles?.includes(roleTeacher)  && !roles?.includes(roleAdmin) && !roles?.includes(roleManager)" routerLink="./teacher">
  <mat-icon matListIcon svgIcon="home-variant"></mat-icon>
    <h3 matLine>Home</h3>
</mat-list-item>

<mat-list-item *ngIf="roles?.includes(roleStudent)" routerLink="./student">
  <mat-icon matListIcon svgIcon="home-variant"></mat-icon>
    <h3 matLine>Home</h3>
</mat-list-item>

  
  `,
  styles: [],


})

export class HomeMenuComponent implements OnInit {

  @Input()
  roles: string[];

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;
 

  constructor() { }

  ngOnInit() {
  }

}
