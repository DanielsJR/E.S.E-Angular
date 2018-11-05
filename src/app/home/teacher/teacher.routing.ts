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
                        component: SubjectListComponent,
                    },

                    {
                        path: 'subject/:id',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'class',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: ':id',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'test',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'test/make-test',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'test/take-test',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'test/edit-test',
                        component: SubjectDetailComponent,
                    },

                    {
                        path: 'test/historical',
                        component: SubjectDetailComponent,
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
