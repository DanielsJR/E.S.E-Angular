import { TeacherRoutingModule } from './teacher.routing';
import { NgModule } from '@angular/core';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';
import { GetUsersModule } from '../get-users/get-users.module';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { TeacherComponent } from './teacher.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    GetUsersModule
  ],

  declarations: [
    TeacherComponent,
    TeacherHomeComponent,
    TeacherSubjectsComponent
  ],

  providers: [

  ]
})
export class TeacherModule { }
