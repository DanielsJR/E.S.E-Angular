import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentHomeComponent } from './student-home/student-home.component';
import { SharedModule } from '../../shared/shared.module';
import { StudentRoutingModule } from './student.routing';
import { StudentComponent } from './student.component';



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
