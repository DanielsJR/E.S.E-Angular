import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';

@Component({
  selector: 'nx-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],

})
export class StudentComponent implements OnInit {

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;
  triggerPruebas = true;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

  }

  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['/']);
  }
}
