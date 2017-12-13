import { AdminGetUsersComponent } from './admin-get-users/admin-get-users.component';
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminAuthGuard } from '../guards/admin-auth-guard.service';
import { AdminGetAdminsComponent } from './admin-get-admins/admin-get-admins.component';
import { AdminGetMangersComponent } from './admin-get-mangers/admin-get-mangers.component';
import { AdminGetTeachersComponent } from './admin-get-teachers/admin-get-teachers.component';
import { AdminGetStudentsComponent } from './admin-get-students/admin-get-students.component';


const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminAuthGuard],
        children: [

            {
                path: 'users',
                children: [
                    {
                        path: 'list-users',
                        component: AdminGetUsersComponent,
                    },
                    {
                        path: 'list-admins',
                        component: AdminGetAdminsComponent,
                    },
                    {
                        path: 'list-managers',
                        component: AdminGetMangersComponent,
                    },
                    {
                        path: 'list-teachers',
                        component: AdminGetTeachersComponent,
                    },
                    {
                        path: 'list-students',
                        component: AdminGetStudentsComponent,
                    },


                ],
            },

            {
                path: '',
                component: AdminHomeComponent
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
export class AdminRoutingModule { }
