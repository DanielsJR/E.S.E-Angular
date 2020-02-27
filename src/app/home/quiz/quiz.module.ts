import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { QuizComponent } from "./quiz.component";
import { QuizDetailComponent } from "./quiz-detail/quiz-detail.component";

@NgModule({
  imports: [
    SharedModule,

  ],

  declarations: [
    QuizComponent,
    QuizDetailComponent,

  ],

  providers: [

  ],

  entryComponents: [

  ],

  exports: [
    QuizDetailComponent,


  ]

})
export class QuizModule { }