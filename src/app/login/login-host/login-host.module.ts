
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginHostComponent } from './login-host.component';
import { LoginModule } from '../login-form/login.module';



const routes: Routes = [
  { path: 'login', component: LoginHostComponent }
];

@NgModule({
  imports: [
    SharedModule,
    LoginModule,
    RouterModule.forChild(routes),
    
  ],

  declarations: [
    LoginHostComponent
  ],

  providers: [
  ]

})

export class LoginHostModule { }
