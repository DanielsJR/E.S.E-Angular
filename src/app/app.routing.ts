import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { AuthGuard } from './guards/auth-guard.service';
import { SelectivePreload } from './services/selective-preload.service';

const routes: Routes = [

    { path: 'about', loadChildren: './about/about.module#AboutModule' },
    { path: 'home', loadChildren: './home/home.module#HomeModule', data: { preload: true }},
    { path: '', redirectTo: '/welcome', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent } // wildcard route the last

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
                // enableTracing: true,
                 preloadingStrategy: SelectivePreload
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
        SelectivePreload
    ]
})

export class AppRoutingModule { }