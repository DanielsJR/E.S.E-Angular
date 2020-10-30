import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";

import { QuizStudentComponent } from "./quiz-student.component";
import { QuizStudentDetailComponent } from "./quiz-student-detail/quiz-student-detail.component";
import { QuizModule } from '../quiz/quiz.module';


@NgModule({
  imports: [
    SharedModule,
    QuizModule,

  ],

  declarations: [
    QuizStudentComponent,
    QuizStudentDetailComponent,

  ],

  providers: [

  ],

  entryComponents: [

  ],

  exports: [
    QuizStudentComponent,
    QuizStudentDetailComponent,

  ]

})
export class QuizStudentModule { }