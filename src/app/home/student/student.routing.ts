import { StudentHomeComponent } from './student-home/student-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentComponent } from './student.component';
import { StudentGuard } from '../../guards/student-guard.service';


const adminRoutes: Routes = [
    {
        path: '',
        component: StudentComponent,
        canActivate: [StudentGuard],
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
