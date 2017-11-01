import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: StudentComponent }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],

  declarations: [
    StudentComponent
  ]
})
export class StudentModule { }
