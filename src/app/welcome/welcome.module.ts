import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { LoginModule } from '../login/login-form/login.module';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent }
];

@NgModule({
  imports: [
    SharedModule,
    LoginModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    WelcomeComponent
  ]
})
export class WelcomeModule { }
