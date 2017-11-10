import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],


})
export class AdminComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;
  triggerPruebas = true;
  
  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

  }

  private logout(): void {
    this.loginService.logout();
    localStorage.removeItem('theme');
    this.router.navigate(['/']);
  }




}
