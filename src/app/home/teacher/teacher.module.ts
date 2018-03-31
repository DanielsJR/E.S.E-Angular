import { TeacherRoutingModule } from './teacher.routing';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectDetailComponent } from './subject-list/subject-detail/subject-detail.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule
  ],

  declarations: [
    SubjectListComponent,
    SubjectDetailComponent,
    TeacherHomeComponent
  ],
  providers: [

  ]
})
export class TeacherModule { }
