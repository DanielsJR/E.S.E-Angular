import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectGradesComponent } from './subject-grades/subject-grades.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectsComponent } from './subjects.component';




const subjectsRoutes: Routes = [
    {
        path: 'subjects',
        component: SubjectsComponent
    },

    {
        path: 'subjects/:id',
        component: SubjectDetailComponent
    },

    {
        path: 'subjects/grades/:username',
        component: SubjectGradesComponent
    }

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
