import { TeacherRoutingModule } from './teacher-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TeacherComponent } from './teacher.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectDetailComponent } from './subject-list/subject-detail/subject-detail.component';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule
  ],

  declarations: [
    TeacherComponent,
    SubjectListComponent,
    SubjectDetailComponent,
    TeacherHomeComponent
  ]
})
export class TeacherModule { }
