import { UserService } from '../shared/services/users.service';
import { User } from '../models/user';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { LocalStorageService } from '../shared/services/local-storage.service';

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

  user: User;

  triggerAsignaturas = true;
  triggerMat = true;
  triggerHist = true;
  triggerPruebas = true;

  scrolled = false;

  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  constructor(private router: Router, private loginService: LoginService,
    private service: UserService, private localStorage: LocalStorageService) { }

  ngOnInit() {
    const token = this.localStorage.getToken();
    this.service.getUserByToken(token).subscribe(data => {
      this.user = data;
    },
     error => console.log('error getting the token ' + error));
  }

  private logout(): void {
    this.loginService.logout();
    this.themePicker.removeTheme();
    this.router.navigate(['/']);
  }

}
