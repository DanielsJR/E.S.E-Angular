import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { AppRoutingModule } from './app.routing';
import { LoginModule } from './login/login.module';
import { WelcomeModule } from './welcome/welcome.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserBackendService } from './services/user-backend.service';
import { LocalStorageService } from './services/local-storage.service';
import { AppAuthInterceptor } from './app-auth-interceptor.interceptor';
import { ManagerStoreService } from './services/manger-store.service';
import { TeacherStoreService } from './services/teacher-store.service';
import { StudentStoreService } from './services/student-store.service';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


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
  ],

  providers: [
    LocalStorageService,
    UserBackendService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppAuthInterceptor,
      multi: true,
    },
    ManagerStoreService,
    TeacherStoreService,
    StudentStoreService,
  ],

  bootstrap: [
    AppComponent,
  ],


})

export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
