import { NgModule } from "@angular/core";
import { SubjectsCrudDialogRefComponent } from "./subjects-crud-dialog-ref/subjects-crud-dialog-ref.component";
import { SubjectGradesComponent } from "./subject-grades/subject-grades.component";
import { SubjectsComponent } from "./subjects.component";
import { SubjectDetailComponent } from "./subject-detail/subject-detail.component";
import { SubjectsRoutingModule } from "./subjects.routing";
import { SubjectsGradesCrudDialogRefComponent } from "./subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component";
import { SubjectsCoursesComponent } from './subjects-courses/subjects-courses.component';
import { SharedModule } from "../../shared/shared.module";
import { UsersModule } from "../users/users.module";
import { SubjectsQuizComponent } from './subjects-quiz/subjects-quiz.component';



@NgModule({
  imports: [
    SharedModule,
    UsersModule,
    SubjectsRoutingModule,
 
  ],

  declarations: [
    SubjectsComponent,
    SubjectsCrudDialogRefComponent,
    SubjectDetailComponent,
    SubjectGradesComponent,
    SubjectsGradesCrudDialogRefComponent,
    SubjectsCoursesComponent,
    SubjectsQuizComponent,
  ],

  providers: [

  ],

  entryComponents: [
   SubjectsCrudDialogRefComponent,
   SubjectsGradesCrudDialogRefComponent
  ],

  exports:[
    SubjectsComponent,
    SubjectDetailComponent,
    SubjectGradesComponent,
    SubjectsCoursesComponent,

  ]

})
export class SubjectsModule { }