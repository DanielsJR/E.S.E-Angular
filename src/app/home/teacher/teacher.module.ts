import { TeacherRoutingModule } from './teacher.routing';
import { NgModule } from '@angular/core';
import { TeacherHomeComponent } from './teacher-home/teacher-home.component';
import { SharedModule } from '../../shared/shared.module';
import { TeacherComponent } from './teacher.component';
import { TeacherSubjectsDetailComponent } from './teacher-subjects/teacher-subject-detail/teacher-subjects-detail.component';
import { UsersModule } from '../users/users.module';
import { SubjectsModule } from '../subjects/subjects.module';
import { TeacherQuizesComponent } from './teacher-quizes/teacher-quizes.component';
import { TeacherQuizesDetailComponent } from './teacher-quizes/teacher-quizes-detail/teacher-quizes-detail.component';
import { TeacherQuizesCreateComponent } from './teacher-quizes/teacher-quizes-create/teacher-quizes-create.component';
import { TeacherQuizesSendQuizComponent } from './teacher-quizes/teacher-quizes-send-quiz/teacher-quizes-send-quiz.component';
import { TeacherSubjectCourseComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-course.component';
import { TeacherSubjectEvaluationsComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-evaluations.component';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { QuizStudentModule } from '../quiz-student/quizStudent.module';
import { TeacherSubjectSendQuizComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-send-quiz.component';
import { TeacherSubjectAttendanceComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-attendance.component';
import { TeacherSubjectGradesComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-grades.component';
import { TeacherSubjectBookComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-book.component';
import { HomeUserModule } from '../home-user/home-user.module';
import { QuizTrueFalseItemComponent } from './teacher-quizes/quiz-items/quiz-true-false-item/quiz-true-false-item.component';
import { QuizCorrespondItemComponent } from './teacher-quizes/quiz-items/quiz-correspond-item/quiz-correspond-item.component';
import { QuizMultipleSelectionItemComponent } from './teacher-quizes/quiz-items/quiz-multiple-selection-item/quiz-multiple-selection-item.component';
import { QuizIncompleteTextItemComponent } from './teacher-quizes/quiz-items/quiz-incomplete-text-item/quiz-incomplete-text-item.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    UsersModule,
    SubjectsModule,
    QuizStudentModule,
    HomeUserModule,
    
  ],

  declarations: [
    TeacherComponent,
    TeacherHomeComponent,
    
    TeacherSubjectsComponent,
    TeacherSubjectsDetailComponent,
    TeacherSubjectGradesComponent,
    TeacherSubjectCourseComponent,
    TeacherSubjectSendQuizComponent,
    TeacherSubjectEvaluationsComponent,
    TeacherSubjectAttendanceComponent,

    TeacherQuizesComponent,
    TeacherQuizesDetailComponent,
    TeacherQuizesCreateComponent,
    TeacherQuizesSendQuizComponent,
    TeacherSubjectBookComponent,
    QuizCorrespondItemComponent,
    QuizTrueFalseItemComponent,
    QuizMultipleSelectionItemComponent,
    QuizIncompleteTextItemComponent,
    
  ],

  exports:[
    TeacherQuizesComponent,
    TeacherQuizesDetailComponent,
    TeacherQuizesCreateComponent,
    TeacherQuizesSendQuizComponent,
    TeacherSubjectBookComponent,

  ],

  providers: [

  ]
})
export class TeacherModule { }
