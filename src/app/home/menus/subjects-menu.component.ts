import { Component, OnInit, Input } from '@angular/core';
import { ROLE_TEACHER, ROLE_ADMIN, ROLE_MANAGER, ROLE_STUDENT } from '../../app.config';

@Component({
  selector: 'nx-subjects-menu',
  template: `

<mat-list-item *ngIf= "roles?.includes(roleManager)" [routerLink]= "['./manager/subjects']" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school" [color]= "rla.isActive ? colorActive : '' "></mat-icon>
    <h3 matLine [class.primaryColor]= "rla.isActive">Asignaturas</h3>
</mat-list-item>  

<mat-divider *ngIf= "roles?.includes(roleTeacher) && roles?.includes(roleManager)"></mat-divider>

<mat-list-item *ngIf= "roles?.includes(roleTeacher)" [routerLink]= "['./teacher/subjects']" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon [svgIcon] ="(roles.includes(roleManager)) ? 'school-outline' : 'school' " [color]= "rla.isActive ? colorActive: '' " ></mat-icon>
    <h3 matLine [class.primaryColor]= "rla.isActive">Mis Asignaturas</h3>
</mat-list-item>

<mat-list-item *ngIf= "roles[0] === roleStudent" [routerLink]= "['./student/subjects']" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school" [color]= "rla.isActive ? colorActive : '' "></mat-icon>
    <h3 matLine [class.primaryColor]= "rla.isActive">Mis Asignaturas</h3>
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

  colorActive = 'primary';

  constructor() { }

  ngOnInit() {
  }



}
