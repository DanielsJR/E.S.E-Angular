import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TdRotateAnimation, TdCollapseAnimation } from '@covalent/core';
import { User } from '../models/user';
import { ThemePickerComponent } from '../shared/theme-picker/theme-picker.component';
import { UserService } from '../shared/services/users.service';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { URI_TEACHERS } from '../app.config';

@Component({

  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css'],
  animations: [
    TdRotateAnimation(),
    TdCollapseAnimation(),
  ],
})
export class TeacherComponent implements OnInit {
  triggerAsignaturas = true;
  subjects = [
    { name: 'Matemáticas', path: 'math' },
    { name: 'Lenguaje', path: 'language' },
    { name: 'Historia', path: 'history' },
    { name: 'Ingles', path: 'english' },
    { name: 'Música', path: 'music' },
  ];

  triggerPruebas = true;
  tests = [
    { action: 'Tomar Prueba', path: 'take-test' },
    { action: 'Crear', path: 'make-test' },
    { action: 'Editar', path: 'edit-test' },
    { action: 'Historial', path: 'historical' },
  ];


  scrolled = false;
  user: User;
  role = this.localStorage.getRole();

  @ViewChild(ThemePickerComponent)
  themePicker: ThemePickerComponent;

  constructor(private router: Router, private loginService: LoginService,
    private service: UserService, private localStorage: LocalStorageService) { }

  ngOnInit() {
    const token = this.localStorage.getToken();
    this.service.getUserByToken(token, URI_TEACHERS).subscribe(data => {
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
