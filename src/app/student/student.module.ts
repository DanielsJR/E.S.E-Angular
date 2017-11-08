import { StudentRoutingModule } from './student.routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { NgModule } from '@angular/core';
import { StudentHomeComponent } from './student-home/student-home.component';



@NgModule({
  imports: [
    SharedModule,
    StudentRoutingModule
  ],

  declarations: [
    StudentComponent,
    StudentHomeComponent
  ]
})
export class StudentModule { }
