import { TeacherRoutingModule } from './teacher.routing';
import { NgModule } from '@angular/core';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersModule } from '../get-users/get-users.module';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { TeacherComponent } from './teacher.component';
import { SubjectsModule } from '../manager/manager-subjects/subjects/subejcts.module';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subjects-detail.component';
import { TeacherSubjectsGradesComponent } from './teacher-subjects/teacher-subjects-grades.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    GetUsersModule,
    SubjectsModule,
    
  ],

  declarations: [
    TeacherComponent,
    TeacherHomeComponent,
    
    TeacherSubjectsComponent,
    TeacherSubjectsDetailComponent,
    TeacherSubjectsGradesComponent,
  ],

  providers: [

  ]
})
export class TeacherModule { }
