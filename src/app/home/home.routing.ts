import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../guards/auth-guard.service';
import { AdminGuard } from '../guards/admin-guard.service';
import { ManagerGuard } from '../guards/manager-guard.service';
import { TeacherGuard } from '../guards/teacher-guard.service';
import { StudentGuard } from '../guards/student-guard.service';
import { ResolverService } from '../services/resolver.service';



const homeRoutes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: HomeComponent,
        children: [
            { path: 'admin',   loadChildren: './../home/admin/admin.module#AdminModule', canLoad: [AdminGuard] },
            { path: 'manager', loadChildren: './../home/manager/manager.module#ManagerModule', canLoad: [ManagerGuard] },
            { path: 'teacher', loadChildren: './../home/teacher/teacher.module#TeacherModule', canLoad: [TeacherGuard]  },
            { path: 'student', loadChildren: './../home/student/student.module#StudentModule', canLoad: [StudentGuard]  },
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
