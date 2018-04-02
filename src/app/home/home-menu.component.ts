import { Component, OnInit, Input } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-home-menu',
  template: `

<mat-list-item *ngIf="privilege === 'ADMIN' " routerLink="/home/admin" routerLinkActive="active">
  <mat-icon matListIcon>home</mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>
  
<mat-list-item *ngIf ="privilege === 'MANAGER' " routerLink="/home/manager" routerLinkActive="active">
  <mat-icon matListIcon>home</mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>  

<mat-list-item *ngIf="privilege === 'TEACHER' " routerLink="/home/teacher" routerLinkActive="active">
  <mat-icon matListIcon>home</mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>

<mat-list-item *ngIf="privilege === 'STUDENT' " routerLink="/home/student" routerLinkActive="active">
  <mat-icon matListIcon>home</mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>
  
  `,
  styles: [],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})

export class HomeMenuComponent implements OnInit {

  @Input()
  privilege: string;

  @Input()
  roles: string[];

  triggerUsers = true;

  constructor() { }

  ngOnInit() {
  }

}
