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
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherQuizesComponent } from '../teacher/teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from '../teacher/teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from '../teacher/teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';
import { TeacherSubjectsComponent } from '../teacher/teacher-subjects/teacher-subjects.component';
import { TeacherSubjectsDetailComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subjects-detail.component';
import { TeacherSubjectCourseComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-course.component';
import { TeacherSubjectEvaluationsComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-evaluations.component';
import { TeacherSubjectAttendanceComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-attendance.component';
import { TeacherSubjectBookComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-book.component';
import { TeacherSubjectSendQuizComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-send-quiz.component';
import { TeacherSubjectGradesComponent } from '../teacher/teacher-subjects/teacher-subject-detail/teacher-subject-grades.component';



const routes: Routes = [
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
                        data: { animation: 'manager-subjects' },
                    },

                    {
                        path: 'subjects/detail',
                        component: ManagerSubjectsDetailComponent,
                        data: { animation: 'subjects-detail' },
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

                    //teacher
                    {
                        path: 'teacher',
                        canActivateChild: [TeacherGuard],
                        children: [
                            {
                                path: 'subjects',
                                component: TeacherSubjectsComponent,
                                data: { animation: 'teacher-subjects' },
                            },

                            {
                                path: 'subjects/detail',
                                component: TeacherSubjectsDetailComponent,
                                data: { animation: 'subjects-detail' },
                                children: [

                                    {
                                        path: 'course/:id',
                                        component: TeacherSubjectCourseComponent,
                                        data: { animation: 'course-id' },
                                    },

                                    {
                                        path: 'evaluations/:id',
                                        component: TeacherSubjectEvaluationsComponent,
                                        data: { animation: 'evaluations-id' },
                                    },

                                    {
                                        path: 'attendance/:id',
                                        component: TeacherSubjectAttendanceComponent,
                                        data: { animation: 'attendance-id' },
                                    },

                                    {
                                        path: 'book/:id',
                                        component: TeacherSubjectBookComponent,
                                        data: { animation: 'book-id' },
                                    },

                                    {
                                        path: 'quiz/:id',
                                        component: TeacherSubjectSendQuizComponent,
                                        data: { animation: 'quiz-id' },
                                    },

                                    {
                                        path: 'grades/:id',
                                        component: TeacherSubjectGradesComponent,
                                        data: { animation: 'grades-id' },
                                    },



                                ]
                            },

                            {
                                path: 'quizes',
                                component: TeacherQuizesComponent,
                                data: { animation: 'quizes' },
                            },

                            {
                                path: 'quizes/detail/:id',
                                component: TeacherQuizesDetailComponent,
                                data: { animation: 'quizes-detail' },

                            },

                            {
                                path: 'quizes/create',
                                component: TeacherQuizesCreateComponent,
                                data: { animation: 'quizes-create' },
                            },

                            {
                                path: 'quizes/import',
                                component: TeacherQuizesComponent,
                                data: { animation: 'quizes-import' },
                            },

                            {
                                path: 'quizes/historical',
                                component: TeacherQuizesComponent,
                                data: { animation: 'quizes-historical' },
                            },


                        ]
                    },

                    {
                        path: '',
                        component: ManagerHomeComponent,
                        data: { animation: 'home' },
                    },


                ],
            }
        ],
        data: { animation: 'manager' },
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],

    exports: [
        RouterModule
    ],

    providers: [

    ]
})

export class ManagerRoutingModule { }
