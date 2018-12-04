import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nx-subjects-menu',
  template: `


<mat-list-item *ngIf = "roles?.includes('MANAGER')" [routerLink]="['./manager/subjects/courses']">
  <mat-icon matListIcon svgIcon="school"></mat-icon>
    <h3 matLine>Administrar Asignaturas</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class ManagerSubjectsMenuComponent implements OnInit {


  @Input()
  roles: string[];

  constructor() { }

  ngOnInit() {
  }



}