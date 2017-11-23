import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';

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

  scrolled = false;

  @ViewChild(ThemePickerComponent)
  private themePicker: ThemePickerComponent;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

  }

  private logout(): void {
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
  }

}
