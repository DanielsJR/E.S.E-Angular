import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { WelcomeModule } from './welcome/welcome.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocalStorageService } from './shared/services/local-storage.service';
import { UserService } from './shared/services/users.service';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor.interceptor';


@NgModule({

  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    WelcomeModule,
    LoginModule,
    AppRoutingModule,
    HttpClientModule
  ],

  declarations: [
    AppComponent,
    PageNotFoundComponent,

  ],

  providers: [
    LocalStorageService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }

  ],

  bootstrap: [
    AppComponent
  ],
  

})

export class AppModule {
}
