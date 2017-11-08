import { PageNotFoundComponent } from '../error-pages/page-not-found.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [

    { path: 'about', loadChildren: './../about/about.module#AboutModule' },
    { path: 'social', loadChildren: './../social/social.module#SocialModule' },
    { path: 'admin', loadChildren: './../admin/admin.module#AdminModule' },
    { path: 'manager', loadChildren: './../manager/manager.module#ManagerModule' },
    { path: 'teacher', loadChildren: './../teacher/teacher.module#TeacherModule' },
    { path: 'student', loadChildren: './../student/student.module#StudentModule' },
    // { path: 'login', loadChildren: './../login/login.module#LoginModule' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent } // wildcard route the last

];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
               // enableTracing: true,
                preloadingStrategy: PreloadAllModules
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
export class CoreRoutingModule { }
