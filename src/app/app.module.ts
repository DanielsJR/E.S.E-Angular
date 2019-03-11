import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { AppRoutingModule } from './app.routing';
import { WelcomeModule } from './welcome/welcome.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppAuthInterceptor } from './app-auth.interceptor';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { Router } from '@angular/router';
import { LoginHostModule } from './login/login-host/login-host.module';



@NgModule({

  imports: [
    // BrowserModule,
    BrowserAnimationsModule,

    SharedModule,
    
    WelcomeModule,
    LoginHostModule,

    AppRoutingModule, // after the other modules with routes
    HttpClientModule,
    MatMomentDateModule,

  ],

  declarations: [
    AppComponent,
    PageNotFoundComponent,

  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AppAuthInterceptor, multi: true, },
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],


  bootstrap: [
    AppComponent,
  ],

  entryComponents: [

  ]


})

export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer, router: Router) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/mdi.svg'));
    //console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
