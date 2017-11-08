import { ManagerAuthGuard } from '../guards/manager-auth-guard.service';
import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { ManagerComponent } from './manager.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminAuthGuard } from '../guards/admin-auth-guard.service';


const adminRoutes: Routes = [
    {
        path: '',
        component: ManagerComponent,
        canActivate: [ManagerAuthGuard],
        children: [

            {
                path: 'asuarios',
                children: [
                    {
                        path: 'make-test',
                        component: ManagerComponent,
                    },

                    {
                        path: 'take-test',
                        component: ManagerComponent,
                    },

                    {
                        path: 'historical',
                        component: ManagerComponent,
                    }
                ],
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
