import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';

const routes: Routes = [

    { path: 'about', loadChildren: './about/about.module#AboutModule' },
    { path: 'home', loadChildren: './home/home.module#HomeModule' },
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent } // wildcard route the last

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
               // enableTracing: true,
                //preloadingStrategy: PreloadAllModules
            }
        )

    ],

    exports: [
        RouterModule
    ],

    declarations: [
        // There are no declarations. Declarations are the responsibility of the companion module.
    ],

    providers: [
        // If you have guard services, the Routing Module adds module providers. (There are none in this example.)
    ]
})

export class AppRoutingModule { }