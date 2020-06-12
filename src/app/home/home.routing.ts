import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AdminGuard } from '../guards/admin-guard.service';
import { ManagerGuard } from '../guards/manager-guard.service';
import { TeacherGuard } from '../guards/teacher-guard.service';
import { StudentGuard } from '../guards/student-guard.service';
import { CanDeactivateGuard } from '../guards/can-deactivate-guard.service';


const homeRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomeComponent,
        children: [
            {
                path: 'admin',
                loadChildren: () => import('./../home/admin/admin.module').then(m => m.AdminModule),
                canLoad: [AdminGuard]
            },

            {
                path: 'manager',
                loadChildren: () => import('./../home/manager/manager.module').then(m => m.ManagerModule),
                canLoad: [ManagerGuard]
            },

            {
                path: 'teacher',
                loadChildren: () => import('./../home/teacher/teacher.module').then(m => m.TeacherModule),
                canLoad: [TeacherGuard]
            },

            {
                path: 'student',
                loadChildren: () => import('./../home/student/student.module').then(m => m.StudentModule),
                canLoad: [StudentGuard]
            },
        ],
        data: { animation: 'main-home' },
        canDeactivate: [CanDeactivateGuard]
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
