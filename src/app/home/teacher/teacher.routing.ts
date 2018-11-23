import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeacherGuard } from '../../guards/teacher-guard.service';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subjects-grades.component';


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
                        path: 'subjects/:id',
                        component: TeacherSubjectsDetailComponent
                    },
    
                    {
                        path: 'subjects/grades/:username',
                        component: TeacherSubjectsGradesComponent
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
