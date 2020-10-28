import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { QuizComponent } from "./quiz.component";
import { QuizItemComponent } from './quiz-item/quiz-item.component';

@NgModule({
  imports: [
    SharedModule,

  ],

  declarations: [
    QuizComponent,
    QuizItemComponent,

  ],

  providers: [

  ],

  exports: [
    QuizComponent,
    QuizItemComponent,

  ]

})
export class QuizModule { }