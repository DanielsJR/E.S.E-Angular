import { PageNotFoundComponent } from '../error-pages/page-not-found.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [

    { path: 'books', loadChildren: './../book/book.module#BookModule' },
    { path: 'about', loadChildren: './../about/about.module#AboutModule' },
    { path: 'social', loadChildren: './../social/social.module#SocialModule' },
    { path: 'login', loadChildren: './../login/login.module#LoginModule' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent } // wildcard route the last

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
       // , { enableTracing: true }) // <-- debugging purposes only)
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
export class CoreRoutingModule { }
