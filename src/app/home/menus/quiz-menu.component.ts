import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ROLE_TEACHER, ROLE_MANAGER } from '../../app.config';
import { tdRotateAnimation, tdCollapseAnimation } from '@covalent/core/common';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nx-quiz-menu',
  templateUrl: 'quiz-menu.component.html',
  styles: [
    ' ::ng-deep #collapsebleDiv mat-list-item .mat-list-item-content { padding-left: 30px !important;} #collapsebleDiv mat-list-item h3 {  font-weight:normal !important; }'
  ],
  animations: [
    tdRotateAnimation,
    tdCollapseAnimation,
  ],

})

export class QuizMenuComponent implements OnInit {


  @Input() roles: string[];
  @Input() shortMenu: boolean;
  roleTeacher = ROLE_TEACHER;
  roleManager = ROLE_MANAGER;
  trigger = true;
  activeColor = 'primary';
  rolePath: string;
  quizLinks = []

  constructor() { }

  ngOnInit() {
    this.rolePath = (this.roles.includes(this.roleManager) ? './manager/teacher' : './teacher');
    this.quizLinks = [
      { name: 'quizes', route: [this.rolePath + '/quizes'] },
      { name: 'quizes-create', route: [this.rolePath + '/quizes/create'] },
      { name: 'quizes-import', route: [this.rolePath + '/quizes/import'] },
      { name: 'quizes-historical', route: [this.rolePath + '/quizes/historical'] },

    ]

  }


}




