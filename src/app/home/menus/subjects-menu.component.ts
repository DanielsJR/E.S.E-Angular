import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-subjects-menu',
  template: `


<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/subjects']">
  <mat-icon matListIcon svgIcon="school"></mat-icon>
    <h3 matLine>Administrar Asignaturas</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class SubjectsMenuComponent implements OnInit {


  @Input()
  roles: string[];

  constructor() { }

  ngOnInit() {
  }



}