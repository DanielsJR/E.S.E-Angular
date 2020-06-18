import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SelectivePreload } from './services/selective-preload.service';
import { HomeResolverService } from './services/home-resolver.service';


const routes: Routes = [

    {
        path: 'not-found',
        loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule),
    },

    {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
    },

    {
        path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        data: { preload: true },
        resolve: { theme: HomeResolverService }
    },

    {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
    },

    {
        path: '**', // wildcard route the last
        redirectTo: 'not-found',
    }

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