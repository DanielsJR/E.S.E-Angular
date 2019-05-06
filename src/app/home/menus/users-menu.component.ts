import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ROLE_MANAGER, ROLE_ADMIN } from '../../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-users-menu',
  template: `

<mat-list-item (click)="trigger = !trigger" *ngIf="roles?.includes(roleAdmin) || roles?.includes(roleManager)">
  <mat-icon matListIcon svgIcon="account-multiple"></mat-icon>
    <h3 matLine>Administrar Usuarios</h3>
  <mat-icon [@tdRotate]="!trigger" svgIcon="menu-down"></mat-icon>
</mat-list-item>

<div [style.overflow]="'hidden'" [@tdCollapse]="trigger">

<mat-list-item *ngIf="roles?.includes(roleAdmin)" [routerLink]="['./admin/managers']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Administradores</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles?.includes(roleAdmin)" [routerLink]="['./admin/teachers']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Docentes</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles?.includes(roleManager)" [routerLink]="['./manager/teachers']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Docentes</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles?.includes(roleManager)" [routerLink]="['./manager/students']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Estudiantes</h3>
</mat-list-item>

</div>

  
  `,
  styles: [],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],

})

export class UsersMenuComponent implements OnInit {


  @Input() roles: string[];

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  trigger = true;
  

   navigationExtras: NavigationExtras = {
    queryParamsHandling: 'preserve',
    preserveFragment: true
  };

  constructor() { }

  ngOnInit() {
  }



}
