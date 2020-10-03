import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subject-detail/teacher-subjects-detail.component';
import { TeacherQuizesComponent } from './teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from './teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from './teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';
import { TeacherQuizesSendQuizComponent } from './teacher-quizes/teacher-quizes-send-quiz/teacher-quizes-send-quiz.component';
import { TeacherSubjectCourseComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-course.component';
import { TeacherSubjectEvaluationsComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-evaluations.component';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { TeacherSubjectSendQuizComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-send-quiz.component';
import { TeacherSubjectGradesComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-grades.component';
import { TeacherSubjectAttendanceComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-attendance.component';
import { TeacherSubjectBookComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-book.component';


const routes: Routes = [
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


                    {
                        path: '',
                        component: TeacherHomeComponent,
                        data: { animation: 'home' },
                    }
                ]
            }
        ],
        data: { animation: 'teacher' },

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
export class TeacherRoutingModule { }
