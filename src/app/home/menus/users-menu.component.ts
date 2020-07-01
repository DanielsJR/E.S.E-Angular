import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ROLE_MANAGER, ROLE_ADMIN } from '../../app.config';
import { tdRotateAnimation, tdCollapseAnimation } from '@covalent/core/common';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'nx-users-menu',
  templateUrl: './users-menu.component.html',
  styles: [
    ' ::ng-deep #collapsebleDiv mat-list-item .mat-list-item-content { padding-left: 30px !important;} #collapsebleDiv mat-list-item h3 {  font-weight:normal !important; }'
  ],

  animations: [
    tdRotateAnimation,
    tdCollapseAnimation,
  ],

})

export class UsersMenuComponent implements OnInit {


  @Input() roles: string[];
  @Input() shortMenu: boolean;
  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  trigger = true;
  //activeColor = 'accent';



  navigationExtras: NavigationExtras = {
    queryParamsHandling: 'preserve',
    preserveFragment: true
  };

  constructor() { }

  ngOnInit() {

  }




}
