import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-courses-menu',
  template: `

<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]= "['./manager/courses']" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon="book-multiple" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive">Cursos</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class CoursesMenuComponent implements OnInit {

  @Input()
  roles: string[];

  constructor() { }

  ngOnInit() {
  }



}
