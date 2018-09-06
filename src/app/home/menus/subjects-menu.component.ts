import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-subjects-menu',
  template: `


<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/subjects']">
  <mat-icon matListIcon svgIcon="book-variant"></mat-icon>
    <h3 matLine>Asignaturas</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class SubjectsMenuComponent implements OnInit {

  @Input()
  privilege: string;

  @Input()
  roles: string[];

  constructor() { }

  ngOnInit() {
  }



}