import { StudentAuthGuard } from '../guards/student-auth-guard.service';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentComponent } from './student.component';

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


const adminRoutes: Routes = [
    {
        path: '',
        component: StudentComponent,
        canActivate: [StudentAuthGuard],
        children: [

            {
                path: 'asuarios',
                children: [
                    {
                        path: 'make-test',
                        component: StudentComponent,
                    },

                    {
                        path: 'take-test',
                        component: StudentComponent,
                    },

                    {
                        path: 'historical',
                        component: StudentComponent,
                    }
                ],
            },

            {
                path: '',
                component: StudentHomeComponent
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
export class StudentRoutingModule { }
