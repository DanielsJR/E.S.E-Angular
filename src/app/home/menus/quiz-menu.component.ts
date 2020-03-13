import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ROLE_TEACHER } from '../../app.config';
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
  trigger = false;
  activeColor = 'primary';
 
  constructor() { }

  ngOnInit() {

  }


  }




