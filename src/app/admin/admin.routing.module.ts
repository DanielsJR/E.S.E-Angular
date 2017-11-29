import { AdminGetUsersComponent } from './admin-get-users/admin-get-users.component';
import { AdminCreateUserComponent } from './admin-create-user/admin-create-user.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminAuthGuard } from '../guards/admin-auth-guard.service';


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
                        path: 'create-user',
                        component: AdminCreateUserComponent,
                    },

                    {
                        path: 'list-users',
                        component: AdminGetUsersComponent,
                    },

                    {
                        path: 'user',
                        component: AdminHomeComponent,
                    }
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
