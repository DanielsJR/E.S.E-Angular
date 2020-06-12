import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectGradesComponent } from './subject-detail/subject-course/subject-grades/subject-grades.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectsComponent } from './subjects.component';
import { SubjectCourseComponent } from './subject-detail/subject-course/subject-course.component';
import { SubjectEvaluationsComponent } from './subject-detail/subject-evaluations/subject-evaluations.component';
import { SubjectSendQuizComponent } from './subject-detail/subject-send-quiz/subject-send-quiz.component';
import { SubjectAttendanceComponent } from './subject-detail/subject-attendance/subject-attendance.component';
import { SubjectBookComponent } from './subject-detail/subject-book/subject-book.component';
import { SubjectBookDetailComponent } from './subject-detail/subject-book/subject-book-detail/subject-book-detail.component';


const routes: Routes = [
    {
        path: 'subjects',
        component: SubjectsComponent,
    },


    {
        path: 'subjects/detail',
        component: SubjectDetailComponent,
        children: [

            {
                path: 'course/:id',
                component: SubjectCourseComponent,
            },

            {
                path: 'evaluations/:id',
                component: SubjectEvaluationsComponent,
            },

            {
                path: 'attendance/:id',
                component: SubjectAttendanceComponent,
            },

            {
                path: 'book/:id',
                component: SubjectBookComponent,
            },

            {
                path: 'book-detail/:id',
                component: SubjectBookDetailComponent,
            },

            {
                path: 'quiz/:id',
                component: SubjectSendQuizComponent,
            },

            {
                path: 'grades/:id',
                component: SubjectGradesComponent,
            },


        ],

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
