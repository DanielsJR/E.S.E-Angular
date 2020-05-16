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
import { ManagerSubjectsGradesComponent } from './manager-subjects/manager-subject-detail/manager-subjects-grades.component';
import { ManagerSubjectsDetailComponent } from './manager-subjects/manager-subject-detail/manager-subjects-detail.component';
import { ManagerSubjectCourseComponent } from './manager-subjects/manager-subject-detail/manager-subject-course.component';
import { ManagerSubjectEvaluationsComponent } from './manager-subjects/manager-subject-detail/manager-subject-evaluations.component';
import { ManagerSubjectsComponent } from './manager-subjects/manager-subjects.component';
import { ManagerSubjectAttendanceComponent } from './manager-subjects/manager-subject-detail/manager-subject-attendance.component';



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
                        data: { animation: 'teachers' },
                    },

                    {
                        path: 'students',
                        component: ManagerGetStudentsComponent,
                        data: { animation: 'students' },
                    },




                    {
                        path: 'courses',
                        component: ManagerCoursesComponent,
                        data: { animation: 'courses' },
                    },

                    {
                        path: 'courses/create',
                        component: ManagerCoursesCreateComponent,
                        data: { animation: 'courses-create' },
                    },

                    {
                        path: 'courses/:name',
                        component: ManagerCoursesDetailComponent,
                        data: { animation: 'courses-name' },
                    },




                    {
                        path: 'subjects',
                        component: ManagerSubjectsComponent,
                        data: { animation: 'subjects' },
                        children: [
                            {
                                path: 'course/:id',
                                component: ManagerSubjectCourseComponent,
                                data: { animation: 'course-id' },
                            },

                            {
                                path: 'evaluations/:id',
                                component: ManagerSubjectEvaluationsComponent,
                                data: { animation: 'evaluations-id' },
                            },


                            {
                                path: 'attendance/:id',
                                component: ManagerSubjectAttendanceComponent,
                                data: { animation: 'attendance-id' },
                            },

                            {
                                path: 'grades/:id',
                                component: ManagerSubjectsGradesComponent,
                                data: { animation: 'grades-id' },
                            },


                        ],
                    },

                    {
                        path: '',
                        component: ManagerHomeComponent,
                        data: { animation: 'manager-home' },
                    },


                ],
            }
        ],
        data: { animation: 'manager' },
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
