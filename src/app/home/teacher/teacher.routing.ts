import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subject-detail/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subject-detail/teacher-subjects-grades.component';
import { TeacherQuizesComponent } from './teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from './teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from './teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';
import { TeacherQuizesSendQuizComponent } from './teacher-quizes/teacher-quizes-send-quiz/teacher-quizes-send-quiz.component';
import { TeacherSubjectCourseComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-course.component';
import { TeacherSubjectQuizComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-quiz.component';
import { TeacherSubjectEvaluationsComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-evaluations.component';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';


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
                        component: TeacherSubjectsComponent
                    },


                    {
                        path: 'subjects/detail/:id',
                        component: TeacherSubjectsDetailComponent,
                        children: [

                            {
                                path: 'course/:id',
                                component: TeacherSubjectCourseComponent
                            },

                            {
                                path: 'evaluations/:id',
                                component: TeacherSubjectEvaluationsComponent
                            },

                            {
                                path: 'quiz/:id',
                                component: TeacherSubjectQuizComponent
                            },

                            {
                                path: 'list/:id',
                                component: TeacherSubjectQuizComponent
                            },

                            {
                                path: 'book/:id',
                                component: TeacherSubjectQuizComponent
                            },


                            {
                                path: 'grades/:username',
                                component: TeacherSubjectsGradesComponent
                            },



                        ]
                    },



                    {
                        path: 'quizes',
                        component: TeacherQuizesComponent
                    },

                    {
                        path: 'quizes/detail/:id',
                        component: TeacherQuizesDetailComponent

                    },

                    {
                        path: 'quizes/create',
                        component: TeacherQuizesCreateComponent
                    },

                    {
                        path: 'quizes/send-quiz',
                        component: TeacherQuizesSendQuizComponent
                    },

                    {
                        path: 'quizes/historical-quiz',
                        component: TeacherQuizesComponent
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
