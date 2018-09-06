import { Component, OnInit, Input } from '@angular/core';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'nx-users-menu',
  template: `

<mat-list-item *ngIf="roles?.includes('ADMIN')" [routerLink]="['./admin/managers']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Administradores</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/teachers']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Docentes</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/students']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
    <h3 matLine>Estudiantes</h3>
</mat-list-item>

  
  `,
  styles: [],

})

export class UsersMenuComponent implements OnInit {

  

  @Input()
  privilege: string;

  @Input()
  roles: string[];

   navigationExtras: NavigationExtras = {
    queryParamsHandling: 'preserve',
    preserveFragment: true
  };

  constructor() { }

  ngOnInit() {
  }



}
