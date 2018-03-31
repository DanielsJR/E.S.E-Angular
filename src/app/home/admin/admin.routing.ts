import { AdminGetUsersComponent } from './admin-get-users/admin-get-users.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminAuthGuard } from '../../guards/admin-auth-guard.service';


const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [AdminAuthGuard],
        children: [

            {
                path: 'users',
                component: AdminGetUsersComponent,
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
