import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { WelcomeModule } from './welcome/welcome.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppAuthInterceptor } from './app-auth-interceptor.interceptor';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { SnackbarsRefComponent } from './shared/snackbars-ref/snackbars-ref.component';


@NgModule({

  imports: [
    // BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    WelcomeModule,
    LoginModule,
    AppRoutingModule,
    HttpClientModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
  ],

  declarations: [
    AppComponent,
    PageNotFoundComponent,
    SnackbarsRefComponent,
        
  ],

  providers: [

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppAuthInterceptor,
      multi: true,
    },
  ],

  bootstrap: [
    AppComponent,
  ],

  entryComponents:[
    SnackbarsRefComponent,
  ]


})

export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
