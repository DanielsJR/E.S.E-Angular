import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectGradesComponent } from './subject-grades/subject-grades.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectsComponent } from './subjects.component';
import { SubjectsCoursesComponent } from './subjects-courses/subjects-courses.component';





const subjectsRoutes: Routes = [

    {
        path: 'subjects/courses',
        component: SubjectsCoursesComponent
    },

    {
        path: 'subjects/courses/:name',
        component: SubjectsComponent
    },

    {
        path: 'subjects/detail/:id',
        component: SubjectDetailComponent
    },

    {
        path: 'subjects/grades/:username',
        component: SubjectGradesComponent
    },


]


@NgModule({
    imports: [
        RouterModule.forChild(subjectsRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [

    ]
})
export class SubjectsRoutingModule { }
