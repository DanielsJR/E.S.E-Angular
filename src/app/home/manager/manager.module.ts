import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { NgModule } from '@angular/core';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager.routing';
import { GetUsersModule } from '../get-users/get-users.module';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerComponent } from './manager.component';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';
import { SubjectsModule } from './manager-subjects/subjects/subejcts.module';
import { ManagerSubjectsComponent } from './manager-subjects/manager-subjects.component';
import { ManagerSubjectsDetailComponent } from './manager-subjects/manager-subjects-detail.component';
import { ManagerSubjectsGradesComponent } from './manager-subjects/manager-subjects-grades.component';






@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule,
    SubjectsModule,
    GetUsersModule,
    
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,

    ManagerGetTeachersComponent,
    ManagerGetStudentsComponent,

    ManagerCoursesComponent,
    ManagerCoursesDetailComponent,
    ManagerCoursesCreateComponent,

    ManagerSubjectsComponent,
    ManagerSubjectsDetailComponent,
    ManagerSubjectsGradesComponent,

  ],

  providers: [

  ],

  entryComponents: [

  ],

  exports:[

  ]

})
export class ManagerModule { }
