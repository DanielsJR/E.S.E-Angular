import { Component, OnInit, Input } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-users-menu',
  template: `

<mat-list-item *ngIf="roles.includes('ADMIN')" routerLink="/home/admin/managers-list/" routerLinkActive="active">
<mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
  <h3 matLine>Managers</h3>
</mat-list-item>

<mat-list-item *ngIf = "roles.includes('MANAGER')" routerLink="/home/manager/teachers-list" routerLinkActive="active">
<mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
  <h3 matLine>Profesores</h3>
</mat-list-item>
<mat-list-item *ngIf = "roles.includes('MANAGER')" routerLink="/home/manager/students-list" routerLinkActive="active">
<mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="account-multiple-outline"></mat-icon>
  <h3 matLine>Alumnos</h3>
</mat-list-item>
  
  `,
  styles: [],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})

export class UsersMenuComponent implements OnInit {

  @Input()
  privilege: string;

  @Input()
  roles: string[];

  triggerUsers = true;

  constructor() { }

  ngOnInit() {
  }

}
