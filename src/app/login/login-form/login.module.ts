import { LoginService } from './login.service';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard } from '../../guards/auth-guard.service';
import { AdminGuard } from '../../guards/admin-guard.service';
import { ManagerGuard } from '../../guards/manager-guard.service';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { StudentGuard } from '../../guards/student-guard.service';


@NgModule({
  imports: [
    SharedModule,
  ],

  declarations: [
    LoginComponent,
    ],

  providers: [
    LoginService
  ],
  exports: [
    LoginComponent
  ]

})

export class LoginModule { }
