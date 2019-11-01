import { NgModule } from "@angular/core";
import { SubjectsCrudDialogRefComponent } from "./subjects-crud-dialog-ref/subjects-crud-dialog-ref.component";
import { SubjectGradesComponent } from "./subject-detail/subject-course/subject-grades/subject-grades.component";
import { SubjectsComponent } from "./subjects.component";
import { SubjectDetailComponent } from "./subject-detail/subject-detail.component";
import { SubjectsRoutingModule } from "./subjects.routing";
import { SubjectsGradesCrudDialogRefComponent } from "./subject-detail/subject-course/subject-grades/subjects-grades-crud-dialog-ref/subjects-grades-crud-dialog-ref.component";
import { SharedModule } from "../../shared/shared.module";
import { UsersModule } from "../users/users.module";
import { SubjectQuizComponent } from './subject-detail/subject-quiz/subject-quiz.component';
import { SubjectCourseComponent } from './subject-detail/subject-course/subject-course.component';
import { SubjectEvaluationsComponent } from './subject-detail/subject-evaluations/subject-evaluations.component';
import { QuizStudentModule } from "../quiz-student/quizStudent.module";
import { QuizModule } from "../quiz/quiz.module";
import { SubjectEvaluationsCourseComponent } from './subject-detail/subject-evaluations/subject-evaluations-course/subject-evaluations-course.component';
import { SubjectEvaluationsCrudDialogRefComponent } from "./subject-detail/subject-evaluations/subject-evaluations-crud-dialog-ref/subject-evaluations-crud-dialog-ref.component";
import { SubjectSendQuizComponent } from './subject-detail/subject-send-quiz/subject-send-quiz.component';



@NgModule({
  imports: [
    SharedModule,
    UsersModule,
    SubjectsRoutingModule,
    QuizStudentModule,
    QuizModule,

  ],

  declarations: [
    SubjectsComponent,
    SubjectsCrudDialogRefComponent,
    
    SubjectDetailComponent,

    SubjectCourseComponent,

    SubjectEvaluationsComponent,
    SubjectEvaluationsCrudDialogRefComponent,
    SubjectEvaluationsCourseComponent,

    SubjectQuizComponent,

    SubjectGradesComponent,
    SubjectsGradesCrudDialogRefComponent,
    SubjectSendQuizComponent,



  ],

  providers: [

  ],

  entryComponents: [
    SubjectsCrudDialogRefComponent,
    SubjectsGradesCrudDialogRefComponent,
    SubjectEvaluationsCrudDialogRefComponent
  ],

  exports: [
    SubjectsComponent,

    SubjectDetailComponent,

    SubjectCourseComponent,
    SubjectEvaluationsComponent,
    SubjectQuizComponent,
    SubjectSendQuizComponent,

    SubjectGradesComponent,


  ]

})

export class SubjectsModule { }