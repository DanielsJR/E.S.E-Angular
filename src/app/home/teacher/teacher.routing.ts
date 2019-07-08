import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subjects-grades.component';
import { TeacherSubjectsCoursesComponent } from './teacher-subjects/teacher-subjects-courses.component';
import { TeacherSubjectsCoursesSubjectsComponent } from './teacher-subjects/teacher-subjects-courses-subjects.component';
import { TeacherQuizesComponent } from './teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from './teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from './teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';


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
                        path: 'subjects/courses',
                        component: TeacherSubjectsCoursesComponent
                    },

                    {
                        path: 'subjects/courses/:name',
                        component: TeacherSubjectsCoursesSubjectsComponent
                    },

                    {
                        path: 'subjects/detail/:id',
                        component: TeacherSubjectsDetailComponent
                    },
    
                    {
                        path: 'subjects/grades/:username',
                        component: TeacherSubjectsGradesComponent
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
                        path: 'quizes/take-quiz',
                        component: TeacherQuizesComponent
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
