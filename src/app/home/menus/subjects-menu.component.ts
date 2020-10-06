import { Component, OnInit, Input } from '@angular/core';
import { ROLE_TEACHER, ROLE_ADMIN, ROLE_MANAGER, ROLE_STUDENT } from '../../app.config';
import { animateText } from '../../shared/animations/animations';

@Component({
  selector: 'nx-subjects-menu',
  template: `

<mat-list-item *ngIf= "roles?.includes(roleManager)" [routerLink]= "links[0].route" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Asignaturas</h3>
</mat-list-item>  

<mat-divider *ngIf= "roles?.includes(roleTeacher) && roles?.includes(roleManager)"></mat-divider>

<mat-list-item *ngIf= "roles?.includes(roleTeacher) && roles?.includes(roleManager)" [routerLink]= "links[1].route" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school-outline" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Mis Asignaturas</h3>
</mat-list-item>  

<mat-list-item *ngIf= "roles?.includes(roleTeacher) && !roles?.includes(roleManager)" [routerLink]= "links[0].route" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Mis Asignaturas</h3>
</mat-list-item>

<mat-list-item *ngIf= "roles[0] === roleStudent" [routerLink]= "links[0].route" routerLinkActive #rla="routerLinkActive">
  <mat-icon matListIcon svgIcon ="school" [class.accentColor]= "rla.isActive"></mat-icon>
    <h3 matLine [class.accentColor]= "rla.isActive" [@animateText]= "sideNavMenuState">Mis Asignaturas</h3>
</mat-list-item>

  `,
  styles: [],
  animations: [
    animateText,
  ]

})

export class SubjectsMenuComponent implements OnInit {


  @Input()
  roles: string[];

  @Input()
  sideNavMenuState: string;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;
  rolePath: string;
  links = []

  constructor() { }

  ngOnInit() {
    this.rolePath = (this.roles.includes(this.roleManager) ?
        './manager' : this.roles.includes(this.roleTeacher) ?
          './teacher' : this.roles.includes(this.roleStudent) ?
            './student' : '');

    this.links = [
      { name: 'subjects', route: [this.rolePath + '/subjects'] },
      { name: 'subjects-teacher', route: [this.rolePath + '/teacher/subjects'] },

    ]
  }


  getPrivilege(): string {
    for (var i = 0; i < this.roles.length; i++) {
      let role = this.roles[i];
      if (role === ROLE_ADMIN) return ROLE_ADMIN;
      if (role === ROLE_MANAGER) return ROLE_MANAGER;
      if (role === ROLE_TEACHER) return ROLE_TEACHER;
      if (role === ROLE_STUDENT) return ROLE_STUDENT;
    }
    console.error('error no role');
    return 'no role';
  }



}
