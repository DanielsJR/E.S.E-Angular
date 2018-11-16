import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { ManagerComponent } from './manager.component';
import { ManagerGuard } from '../../guards/manager-guard.service';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerSubjectsComponent } from './manager-subjects/manager-subjects.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';
import { ManagerSubjectDetailComponent } from './manager-subjects/manager-subject-detail/manager-subject-detail.component';
import { ManagerSubjectGradesComponent } from './manager-subjects/manager-subject-grades/manager-subject-grades.component';


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
                        path: 'subjects',
                        component: ManagerSubjectsComponent
                    },

                    {
                        path: 'subjects/:id',
                        component: ManagerSubjectDetailComponent
                    },

                    {
                        path: 'subjects/grades/:username',
                        component: ManagerSubjectGradesComponent
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
