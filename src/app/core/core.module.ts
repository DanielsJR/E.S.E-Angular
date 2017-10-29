import { AlumnoComponent } from '../alumno/alumno.component';
import { DocenteComponent } from '../docente/docente.component';
import { BookService2 } from '../book/book2.service';
import { PageNotFoundComponent } from '../error-pages/page-not-found.component';
import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared/shared.module';
import { ShellComponent } from './shell/shell.component';
import { MainContentComponent } from './shell/main-content/main-content.component';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from '../book/book.service';
import { HTTPService } from '../services/http.service';
import { LocalStorageService } from '../services/local-storage.service';
import { HomeModule } from '../home/home.module';
import { BookStoreService } from '../book/book-store.service';

import { CovalentLayoutModule, CovalentStepsModule /*, any other modules */ } from '@covalent/core';


@NgModule({
  imports: [
    SharedModule,
    HomeModule,
    CoreRoutingModule,
    HttpModule,
    HttpClientModule,
    CovalentLayoutModule,
    CovalentStepsModule,
   ],

  declarations: [
    ShellComponent,
    MainContentComponent,
    PageNotFoundComponent,
    DocenteComponent,
    AlumnoComponent
  ],
  providers: [
    HTTPService,
    LocalStorageService,
    BookService,
    BookService2,
    BookStoreService
  ],

  exports: [
    ShellComponent
  ]
})

export class CoreModule {

      // Prevent reimport of the CoreModule
      constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }
 }
