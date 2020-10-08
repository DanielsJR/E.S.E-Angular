import { Component, OnInit, Input } from '@angular/core';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../../app.config';
import { animateText } from '../../shared/animations/animations';

@Component({
  selector: 'nx-home-menu',
  templateUrl: 'home-menu.component.html',
  styles: [],
  animations: [
    animateText,
  ]
})

export class HomeMenuComponent implements OnInit {

  @Input() roles: string[];

  @Input() sideNavMenuState: string;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;


  constructor() { }

  ngOnInit() {
  }

}
