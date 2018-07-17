import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SubjectDetailComponent } from './subject-list/subject-detail/subject-detail.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';


const teacherRoutes: Routes = [
    {
        path: '',
        canActivate: [TeacherGuard],
        children: [

            {
                path: '',
                canActivateChild: [TeacherGuard],
                children: [
                    {
                        path: 'subject',
                        children: [
                            {
                                path: ':id',
                                component: SubjectDetailComponent,
                                children: [
                                    {
                                        path: 'class',
                                        children: [
                                            {
                                                path: ':id',
                                                component: SubjectDetailComponent,
                                            }
                                        ],
                                    }
                                ],
                            }
                        ],


                    },

                    {
                        path: 'test',

                        children: [
                            {
                                path: 'make-test',
                                component: SubjectDetailComponent,
                            },

                            {
                                path: 'take-test',
                                component: SubjectDetailComponent,
                            },

                            {
                                path: 'edit-test',
                                component: SubjectDetailComponent,
                            },

                            {
                                path: 'historical',
                                component: SubjectDetailComponent,
                            }
                        ],
                    },

                    {
                        path: '',
                        component: TeacherHomeComponent
                    }
                ]
            }
        ]

    }
];

@NgModule({
    imports: [
        RouterModule.forChild(teacherRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})
export class TeacherRoutingModule { }
