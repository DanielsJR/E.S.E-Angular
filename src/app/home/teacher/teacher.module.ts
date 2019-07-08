import { TeacherRoutingModule } from './teacher.routing';
import { NgModule } from '@angular/core';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subjects-grades.component';
import { TeacherSubjectsCoursesComponent } from './teacher-subjects/teacher-subjects-courses.component';
import { TeacherSubjectsCoursesSubjectsComponent } from './teacher-subjects/teacher-subjects-courses-subjects.component';
import { UsersModule } from '../users/users.module';
import { SubjectsModule } from '../subjects/subejcts.module';
import { TeacherQuizesComponent } from './teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from './teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from './teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    UsersModule,
    SubjectsModule,
    
  ],

  declarations: [
    TeacherComponent,
    TeacherHomeComponent,
    
    TeacherSubjectsCoursesComponent,
    TeacherSubjectsCoursesSubjectsComponent,
    TeacherSubjectsDetailComponent,
    TeacherSubjectsGradesComponent,
    TeacherQuizesComponent,
    TeacherQuizesDetailComponent,
    TeacherQuizesCreateComponent,
  ],

  providers: [

  ]
})
export class TeacherModule { }
