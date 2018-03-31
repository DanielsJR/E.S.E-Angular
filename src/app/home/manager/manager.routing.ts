import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { ManagerAuthGuard } from '../../guards/manager-auth-guard.service';


const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [ManagerAuthGuard],
        children: [

            {
                path: 'users',
                children: [
                    {
                        path: 'teachers-list',
                        component: ManagerGetTeachersComponent,
                    },

                    {
                        path: 'students-list',
                        component: ManagerGetStudentsComponent,
                    }
                ],
            },

            {
                path: 'courses',
                component: ManagerHomeComponent
            },

            {
                path: 'assign-subject',
                component: ManagerHomeComponent
            },

            {
                path: '',
                component: ManagerHomeComponent
            }
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})
export class ManagerRoutingModule { }
