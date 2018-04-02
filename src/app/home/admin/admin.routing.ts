import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminAuthGuard } from '../../guards/admin-auth-guard.service';
import { AdminGetManagersComponent } from './admin-get-users/admin-get-managers.component';


const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [AdminAuthGuard],
        children: [

            {
                path: 'managers-list',
                component: AdminGetManagersComponent,
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
