import { LoginService } from './login.service';
import { AuthGuard } from '../guards/auth-guard.service';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';


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
    AuthGuard,
    LoginService
  ]

})

export class LoginModule { }
