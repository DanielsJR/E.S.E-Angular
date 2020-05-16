import { AdminHomeComponent } from './admin-home/admin-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminGetManagersComponent } from './admin-get-users/admin-get-managers.component';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../../guards/admin-guard.service';
import { AdminGetTeachersComponent } from './admin-get-users/admin-get-teachers.component';



const adminRoutes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
            {
                path: '',
                canActivateChild: [AdminGuard],
                children: [

                    {
                        path: 'managers',
                        component: AdminGetManagersComponent,
                        data: { animation: 'managers' },
                    },

                    {
                        path: 'teachers',
                        component: AdminGetTeachersComponent,
                        data: { animation: 'teachers' },
                    },


                    {
                        path: '',
                        component: AdminHomeComponent,
                        data: { animation: 'admin-home' },
                    }

                ]
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
        // AdminGetManagersResolver
    ]
})
export class AdminRoutingModule { }
