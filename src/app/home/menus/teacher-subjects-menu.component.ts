import { Component, OnInit, Input } from '@angular/core';
import { ROLE_TEACHER, ROLE_ADMIN, ROLE_MANAGER } from '../../app.config';

@Component({
  selector: 'nx-teacher-subjects-menu',
  template: `


<mat-list-item *ngIf = "roles?.includes(roleTeacher)"
 [routerLink]="['./teacher/subjects/courses']">
  <mat-icon matListIcon svgIcon="school"></mat-icon>
    <h3 matLine>Asignaturas Impartidas</h3>
</mat-list-item>
  
  `,
  styles: [],

})

export class TeacherSubjectsMenuComponent implements OnInit {


  @Input()
  roles: string[];

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  constructor() { }

  ngOnInit() {
  }



}
