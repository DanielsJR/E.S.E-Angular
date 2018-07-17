import { LoginService } from './login.service';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard.service';
import { AdminGuard } from '../guards/admin-guard.service';
import { ManagerGuard } from '../guards/manager-guard.service';
import { TeacherGuard } from '../guards/teacher-guard.service';
import { StudentGuard } from '../guards/student-guard.service';



const routes: Routes = [
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),

  ],

  declarations: [
    LoginComponent
  ],

  providers: [
    AuthGuard,
    AdminGuard,
    ManagerGuard,
    TeacherGuard,
    StudentGuard,
    LoginService
  ]

})

export class LoginModule { }
