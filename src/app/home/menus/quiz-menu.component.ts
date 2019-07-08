import { Component, OnInit, Input } from '@angular/core';
import { ROLE_TEACHER } from '../../app.config';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-quiz-menu',
  template: `

<mat-list-item (click)="trigger= !trigger" *ngIf="roles?.includes(roleTeacher)">
  <mat-icon matListIcon svgIcon="file-document"></mat-icon>
    <h3 matLine>Pruebas</h3>
  <mat-icon [@tdRotate]="!trigger" svgIcon="menu-down"></mat-icon>
</mat-list-item>

<div [style.overflow]="'hidden'" [@tdCollapse]="trigger">

<mat-list-item [routerLink]="['./teacher/quizes']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="file-document-box-outline"></mat-icon>
    <h3 matLine>Mis Pruebas</h3>
</mat-list-item>

<mat-list-item [routerLink]="['./teacher/quizes/take-quiz']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="file-document-box"></mat-icon>
    <h3 matLine>Tomar Prueba</h3>
</mat-list-item>

<mat-list-item [routerLink]="['./teacher/quizes/historical-quiz']">
  <mat-icon matListIcon></mat-icon><mat-icon matListIcon svgIcon="file-document-box-multiple"></mat-icon>
    <h3 matLine>Historial de Pruebas</h3>
</mat-list-item>

</div>

  
  `,
  styles: [],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],

})

export class QuizMenuComponent implements OnInit {


  @Input() roles: string[];

  roleTeacher = ROLE_TEACHER;
  trigger = true;
  
  constructor() { }

  ngOnInit() {
  }



}
