import { StudentHomeComponent } from './student-home/student-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentAuthGuard } from '../../guards/student-auth-guard.service';


const adminRoutes: Routes = [
    {
        path: '',
        canActivate: [StudentAuthGuard],
        children: [

            {
                path: 'asuarios',
                children: [
                    {
                        path: 'make-test',
                        component: StudentHomeComponent,
                    },

                    {
                        path: 'take-test',
                        component: StudentHomeComponent,
                    },

                    {
                        path: 'historical',
                        component: StudentHomeComponent,
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
