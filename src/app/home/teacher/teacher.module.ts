import { TeacherRoutingModule } from './teacher.routing';
import { NgModule } from '@angular/core';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';
import { TeacherComponent } from './teacher.component';
import { SubjectsModule } from '../manager/manager-subjects/subjects/subejcts.module';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subjects-grades.component';
import { TeacherSubjectsCoursesComponent } from './teacher-subjects/teacher-subjects-courses.component';
import { TeacherSubjectsCoursesSubjectsComponent } from './teacher-subjects/teacher-subjects-courses-subjects.component';
import { UsersModule } from '../users/users.module';


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
  ],

  providers: [

  ]
})
export class TeacherModule { }
