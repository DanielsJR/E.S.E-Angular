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
import { ManagerCreateCourseComponent } from './manager-courses/manager-create-course/manager-create-course.component';


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
                        component: ManagerCreateCourseComponent,
                    },

                    {
                        path: 'courses/detail/:name',
                        component: ManagerCoursesDetailComponent,
                    },

                    {
                        path: 'subjects',
                        component: ManagerSubjectsComponent
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
