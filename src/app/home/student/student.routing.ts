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
                        component: StudentSubjectsComponent
                    },

                    {
                        path: 'subjects/detail/:id',
                        component: StudentSubjectsDetailComponent,
                        children: [

                            {
                                path: 'grades/:id',
                                component: StudentSubjectsGradesComponent
                            },

                            {
                                path: 'course/:id',
                                component: StudentSubjectCourseComponent
                            },


                            {
                                path: 'quiz/:id',
                                component: StudentSubjectsQuizComponent,
                                canDeactivate: [CanDeactivateGuard]
                            },

                            {
                                path: 'attendance/:id',
                                component: StudentSubjectsComponent
                            },

                            {
                                path: 'book/:id',
                                component: StudentSubjectsComponent
                            },




                        ]
                    },

                    {
                        path: '',
                        component: StudentHomeComponent
                    }


                ]
            },

        ]
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
