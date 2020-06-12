import { StudentHomeComponent } from './student-home/student-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentComponent } from './student.component';
import { StudentGuard } from '../../guards/student-guard.service';
import { StudentSubjectsComponent } from './student-subjects/student-subjects.component';
import { StudentSubjectsDetailComponent } from './student-subjects/student-subjects-detail.component';
import { StudentSubjectCourseComponent } from './student-subjects/student-subject-course.component';
import { StudentSubjectsGradesComponent } from './student-subjects/student-subjects-grades.component';
import { StudentSubjectsQuizComponent } from './student-subjects/student-subjects-quiz/student-subjects-quiz.component';
import { CanDeactivateGuard } from '../../guards/can-deactivate-guard.service';


const routes: Routes = [
    {
        path: '',
        component: StudentComponent,
        canActivate: [StudentGuard],
        children: [

            {
                path: '',
                canActivateChild: [StudentGuard],
                children: [

                    {
                        path: 'subjects',
                        component: StudentSubjectsComponent,
                        data: { animation: 'student-subjects' },
                    },

                    {
                        path: 'subjects/detail',
                        component: StudentSubjectsDetailComponent,
                        data: { animation: 'subjects-detail' },
                        children: [



                            {
                                path: 'course/:id',
                                component: StudentSubjectCourseComponent,
                                data: { animation: 'course-id' },
                            },

                            {
                                path: 'attendance/:id',
                                component: StudentSubjectsComponent,
                                data: { animation: 'attendance-id' },
                            },

                            {
                                path: 'book/:id',
                                component: StudentSubjectsComponent,
                                data: { animation: 'book-id' },
                            },

                            {
                                path: 'grades/:id',
                                component: StudentSubjectsGradesComponent,
                                data: { animation: 'student-grades-id' },
                            },

                            {
                                path: 'quiz/:id',
                                component: StudentSubjectsQuizComponent,
                                data: { animation: 'quiz-id' },
                                canDeactivate: [CanDeactivateGuard]
                            },


                        ]
                    },

                    {
                        path: '',
                        component: StudentHomeComponent,
                        data: { animation: 'home' },
                    }


                ]
            },

        ],
        data: { animation: 'student' },
    }

];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],

    exports: [
        RouterModule
    ]
})
export class StudentRoutingModule { }
