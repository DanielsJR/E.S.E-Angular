
import { Component, Input, OnInit, } from '@angular/core';
import { ROLE_ADMIN, ROLE_MANAGER, ROLE_MANAGERS_SPANISH, ROLE_STUDENT, ROLE_STUDENTS_SPANISH, ROLE_TEACHER, ROLE_TEACHERS_SPANISH, TITLE_COURSES, TITLE_MY_SUBJECTS, TITLE_PREFERENCES, TITLE_PROFILE, TITLE_QUIZES, TITLE_SUBJECTS } from '../../app.config';
import { UserLoggedService } from '../../services/user-logged.service';
import { HomeUserService } from './home-user.service';

@Component({
  selector: 'nx-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {

  @Input()
  areaRole: string;

  roleAdmin = ROLE_ADMIN;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;
  roleStudent = ROLE_STUDENT;

  titleManagers = ROLE_MANAGERS_SPANISH;
  titleTeachers = ROLE_TEACHERS_SPANISH;
  titleStudents = ROLE_STUDENTS_SPANISH;

  titleCourses = TITLE_COURSES;
  titleSubjetcs = TITLE_SUBJECTS;
  titleMySubjects = TITLE_MY_SUBJECTS;
  titleMyQuizes = TITLE_QUIZES;
  titleProfile = TITLE_PROFILE
  titlePreferences = TITLE_PREFERENCES;

  userMenus: any[] = [];

  profileMenu: any[] = [];
  preferencesMenu: any[] = [];
  managerMenus: any[] = [];
  adminMenus: any[] = [];
  teacherMenus: any[] = [];
  studentMenus: any[] = [];

  constructor(private userLoggedService: UserLoggedService, private homeUserService: HomeUserService) {
    this.setAllMenus();
  }

  ngOnInit(): void {
    this.setUserMenus();
  }

  setAllMenus() {
    this.setProfileMenu();
    this.setPreferencesMenu();
    this.setAdminMenus();
    this.setManagerMenus();
    this.setTeacherMenus();
    this.setStudentMenus();
  }

  setProfileMenu() {
    this.profileMenu = [
      {
        title: this.titleProfile,
        description: 'Administra tu perfil de usuario.',

      }
    ];
  }

  setPreferencesMenu() {
    this.preferencesMenu = [
      {
        title: this.titlePreferences,
        description: 'Configura el aspecto, notificaciones y más en la aplicación.',

      }
    ];

  }

  setAdminMenus() {
    this.adminMenus = [
      {
        title: this.titleManagers,
        description: 'Crea cuentas de perfil Administrador, además de modificar o eliminar datos existentes. Los Administradores también podrán editar sus propios datos.',
        route: ['./managers']
      },
      {
        title: this.titleTeachers,
        description: 'Asigna o remueve Privilegios de Administrador a una cuenta de perfil Docente.',
        route: ['./teachers']
      },
    ];

  }

  setManagerMenus() {
    this.managerMenus = [
      {
        title: this.titleTeachers,
        description: 'Crea cuentas de perfil Docente, además de modificar o eliminar datos existentes. Los Docentes también podrán editar sus propios datos.',
        route: ['./teachers']
      },
      {
        title: this.titleStudents,
        description: 'Crea cuentas de perfil Estudiante, además de modificar o eliminar datos existentes.',
        route: ['./students']
      },
      {
        title: this.titleCourses,
        description: 'Crea, modifica o elimina Cursos para un periodo determinado.',
        route: ['./courses']
      },
      {
        title: this.titleSubjetcs,
        description: 'Crea, modifica o elimina las Asignaturas de un Curso para un periodo determinado.',
        route: ['./subjects']
      },
    ];

  }

  setTeacherMenus() {
    this.teacherMenus = [
      {
        title: this.titleMySubjects,
        description: 'Administra las Asignaturas que impartes en un periodo dado.',
        route: (this.userLoggedService.isManager()) ? ['./teacher/subjects'] : ['./subjects']
      },
      {
        title: this.titleMyQuizes,
        description: 'Busca, crea, modifica o elimina tus pruebas. Otros Docentes también podran utilizarlas si las compartes.',
        route: (this.userLoggedService.isManager()) ? ['./teacher/quizes'] : ['./quizes']
      },
    ];
  }

  setStudentMenus() {
    this.studentMenus = [
      {
        title: this.titleMySubjects,
        description: 'Consulta tus notas, promedios, asistencias y más para una determinada Asignatura.',
        route: ['./subjects']
      },
    ];
  }

  setUserMenus(): any[] {
    if (this.areaRole === this.roleAdmin) this.userMenus = this.adminMenus;

    else if (this.areaRole === this.roleManager) this.userMenus = this.managerMenus;

    else if (this.areaRole === this.roleTeacher) this.userMenus = this.teacherMenus;

    else if (this.areaRole === this.roleStudent) this.userMenus = this.studentMenus;

    else return this.userMenus = [];

    if (this.areaRole === this.roleManager && this.userLoggedService.isTeacher()) this.userMenus = this.userMenus.concat(this.teacherMenus);

    return this.userMenus = this.userMenus.concat(this.profileMenu, this.preferencesMenu);

  }

  emitMenuAction(title: string) {
    this.homeUserService.emitAction(title);
  }

}
