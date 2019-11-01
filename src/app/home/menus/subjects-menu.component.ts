import { Component, OnInit, Input } from '@angular/core';
import { ROLE_TEACHER, ROLE_ADMIN, ROLE_MANAGER, ROLE_STUDENT } from '../../app.config';

@Component({
  selector: 'nx-subjects-menu',
  template: `

<mat-list-item *ngIf= "roles?.includes(roleManager)" [routerLink]= "['./manager/subjects']">
  <mat-icon matListIcon svgIcon ="school"></mat-icon>
    <h3 matLine>Administrar Asignaturas</h3>
</mat-list-item>  

<mat-list-item *ngIf= "roles?.includes(roleTeacher)" [routerLink]= "['./teacher/subjects']">
  <mat-icon matListIcon [svgIcon] ="(roles.includes(roleManager)) ? 'school-outline' : 'school' " ></mat-icon>
    <h3 matLine>Asignaturas Impartidas</h3>
</mat-list-item>

<mat-list-item *ngIf= "roles[0] === roleStudent" [routerLink]= "['./student/subjects']">
  <mat-icon matListIcon svgIcon ="school"></mat-icon>
    <h3 matLine>Mis Asignaturas</h3>
</mat-list-item>

  `,
  styles: [],

})

export class SubjectsMenuComponent implements OnInit {


  @Input()
  roles: string[];

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  constructor() { }

  ngOnInit() {
  }



}
