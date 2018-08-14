import { Component, OnInit, Input } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-home-menu',
  template: `

<mat-list-item *ngIf="privilege === 'ADMIN' " routerLink="./admin">
  <mat-icon matListIcon svgIcon="home-variant"></mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>
  
<mat-list-item *ngIf ="privilege === 'MANAGER' " routerLink="./manager">
<mat-icon matListIcon svgIcon="home-variant"></mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>  

<mat-list-item *ngIf="privilege === 'TEACHER' " routerLink="./teacher">
<mat-icon matListIcon svgIcon="home-variant"></mat-icon>
  <h3 matLine>Home</h3>
</mat-list-item>

<mat-list-item *ngIf="privilege === 'STUDENT' " routerLink="./student">
<mat-icon matListIcon svgIcon="home-variant"></mat-icon>
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
