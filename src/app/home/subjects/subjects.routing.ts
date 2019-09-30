import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectGradesComponent } from './subject-detail/subject-course/subject-grades/subject-grades.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectsComponent } from './subjects.component';
import { SubjectCourseComponent } from './subject-detail/subject-course/subject-course.component';
import { SubjectQuizComponent } from './subject-detail/subject-quiz/subject-quiz.component';
import { SubjectEvaluationsComponent } from './subject-detail/subject-evaluations/subject-evaluations.component';


const routes: Routes = [

    {
        path: 'subjects',
        component: SubjectsComponent
    },

    {
        path: 'subjects/detail/:id',
        component: SubjectDetailComponent,
        children: [

            {
                path: 'course/:id',
                component: SubjectCourseComponent
            },

            {
                path: 'evaluations/:id',
                component: SubjectEvaluationsComponent
            },

            {
                path: 'quiz/:id',
                component: SubjectQuizComponent
            },

            {
                path: 'list/:id',
                component: SubjectQuizComponent
            },

            {
                path: 'book/:id',
                component: SubjectQuizComponent
            },

            {
                path: 'grades/:id',
                component: SubjectGradesComponent
            },



        ]
    },

]


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
})

export class SubjectsRoutingModule { }
