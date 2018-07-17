import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../guards/auth-guard.service';


const homeRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomeComponent,
        children: [

            { path: 'admin', loadChildren: './../home/admin/admin.module#AdminModule' },
            { path: 'manager', loadChildren: './../home/manager/manager.module#ManagerModule' },
            { path: 'teacher', loadChildren: './../home/teacher/teacher.module#TeacherModule' },
            { path: 'student', loadChildren: './../home/student/student.module#StudentModule' },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(homeRoutes)
    ],

    exports: [
        RouterModule
    ],

    providers: [

    ]
})
export class HomeRoutingModule { }
