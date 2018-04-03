import { ManagerAuthGuard } from '../guards/manager-auth-guard.service';
import { StudentAuthGuard } from '../guards/student-auth-guard.service';
import { TeacherAuthGuard } from '../guards/teacher-auth-guard.service';
import { AdminAuthGuard } from '../guards/admin-auth-guard.service';
import { LoginService } from './login.service';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { HomeAuthGuard } from '../guards/home-auth-guard.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    LoginComponent
  ],

  providers: [
    HomeAuthGuard,
    AdminAuthGuard,
    ManagerAuthGuard,
    TeacherAuthGuard,
    StudentAuthGuard,
    LoginService
  ]

})

export class LoginModule { }
