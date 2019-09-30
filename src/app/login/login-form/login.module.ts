import { LoginService } from './login.service';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../shared/shared.module';


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
