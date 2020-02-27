import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './error-pages/page-not-found.component';
import { SelectivePreload } from './services/selective-preload.service';
import { HomeResolverService } from './services/home-resolver.service';


const routes: Routes = [

    { path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule) },

    {
        path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: { preload: true },
        resolve: { theme: HomeResolverService }
    },

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