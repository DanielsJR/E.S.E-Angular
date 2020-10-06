import { Component, OnInit, Input } from '@angular/core';
import { animateText } from '../../shared/animations/animations';

@Component({
  selector: 'nx-courses-menu',
  template: `

<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]= "['./manager/courses']" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon="book-multiple" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Cursos</h3>
</mat-list-item>
  
  `,
  styles: [],
  animations: [
    animateText,
  ]

})

export class CoursesMenuComponent implements OnInit {

  @Input() roles: string[];

  @Input() sideNavMenuState: string;

  constructor() { }

  ngOnInit() {
  }



}
