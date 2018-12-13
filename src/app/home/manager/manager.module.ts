import { ManagerHomeComponent } from './manager-home/manager-home.component';
import { NgModule } from '@angular/core';
import { ManagerGetStudentsComponent } from './manager-get-students/manager-get-students.component';
import { SharedModule } from '../../shared/shared.module';
import { ManagerRoutingModule } from './manager.routing';
import { ManagerGetTeachersComponent } from './manager-get-teachers/manager-get-teachers.component';
import { ManagerComponent } from './manager.component';
import { ManagerCoursesComponent } from './manager-courses/manager-courses.component';
import { ManagerCoursesDetailComponent } from './manager-courses/manager-courses-detail/manager-courses-detail.component';
import { ManagerCoursesCreateComponent } from './manager-courses/manager-courses-create/manager-courses-create.component';

import { ManagerSubjectsDetailComponent } from './manager-subjects/manager-subjects-detail.component';
import { ManagerSubjectsGradesComponent } from './manager-subjects/manager-subjects-grades.component';
import { ManagerSubjectsCoursesComponent } from './manager-subjects/manager-subjects-courses.component';
import { ManagerSubjectsCoursesSubjectsComponent } from './manager-subjects/manager-subjects-courses-subjects.component';
import { UsersModule } from '../users/users.module';
import { SubjectsModule } from '../subjects/subejcts.module';


@NgModule({
  imports: [
    SharedModule,
    ManagerRoutingModule,
    SubjectsModule,
    UsersModule,
    
  ],

  declarations: [
    ManagerComponent,
    ManagerHomeComponent,

    ManagerGetTeachersComponent,
    ManagerGetStudentsComponent,

    ManagerCoursesComponent,
    ManagerCoursesDetailComponent,
    ManagerCoursesCreateComponent,

    ManagerSubjectsDetailComponent,
    ManagerSubjectsGradesComponent,
    ManagerSubjectsCoursesComponent,
    ManagerSubjectsCoursesSubjectsComponent,
    

  ],

  providers: [

  ],

  entryComponents: [

  ],

  exports:[

  ]

})
export class ManagerModule { }
