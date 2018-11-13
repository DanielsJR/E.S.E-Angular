import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-courses-menu',
  template: `


<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/courses']">
  <mat-icon matListIcon svgIcon="book-variant"></mat-icon>
    <h3 matLine>Cursos</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class CoursesMenuComponent implements OnInit {

  @Input()
  privilege: string;

  @Input()
  roles: string[];

  constructor() { }

  ngOnInit() {
  }



}
