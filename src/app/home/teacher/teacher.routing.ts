import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { TeacherComponent } from './teacher.component';


const teacherRoutes: Routes = [
    {
        path: '',
        component: TeacherComponent,
        canActivate: [TeacherGuard],
        children: [

            {
                path: '',
                canActivateChild: [TeacherGuard],
                children: [
                    {
                        path: 'subjects',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'subject/:id',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'class',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: ':id',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'test',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'test/make-test',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'test/take-test',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'test/edit-test',
                        component: TeacherSubjectsComponent,
                    },

                    {
                        path: 'test/historical',
                        component: TeacherSubjectsComponent,
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
