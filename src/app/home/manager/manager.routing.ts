import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { ManagerComponent } from './manager.component';
import { ManagerGuard } from '../../guards/manager-guard.service';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';
import { ManagerSubjectsGradesComponent } from './manager-subjects/manager-subjects-grades.component';
import { ManagerSubjectsDetailComponent } from './manager-subjects/manager-subjects-detail.component';
import { ManagerSubjectsCoursesComponent } from './manager-subjects/manager-subjects-courses.component';
import { ManagerSubjectsCoursesSubjectsComponent } from './manager-subjects/manager-subjects-courses-subjects.component';



const adminRoutes: Routes = [
    {
        path: '',
        component: ManagerComponent,
        canActivate: [ManagerGuard],

        children: [
            {
                path: '',
                canActivateChild: [ManagerGuard],
                children: [

                    {
                        path: 'teachers',
                        component: ManagerGetTeachersComponent,
                    },

                    {
                        path: 'students',
                        component: ManagerGetStudentsComponent,
                    },

                    {
                        path: 'courses',
                        component: ManagerCoursesComponent,

                    },

                    {
                        path: 'courses/create',
                        component: ManagerCoursesCreateComponent,
                    },

                    {
                        path: 'courses/:name',
                        component: ManagerCoursesDetailComponent,
                    },




                    {
                        path: 'subjects/courses',
                        component: ManagerSubjectsCoursesComponent
                    },

                    {
                        path: 'subjects/courses/:name',
                        component: ManagerSubjectsCoursesSubjectsComponent
                    },

                    {
                        path: 'subjects/detail/:id',
                        component: ManagerSubjectsDetailComponent
                    },

                    {
                        path: 'subjects/grades/:username',
                        component: ManagerSubjectsGradesComponent
                    },





                    {
                        path: '',
                        component: ManagerHomeComponent
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

    ]
})
export class ManagerRoutingModule { }
