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
import { TeacherSubjectQuizComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-quiz.component';
import { TeacherSubjectEvaluationsComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-evaluations.component';
import { TeacherSubjectsComponent } from './teacher-subjects/teacher-subjects.component';
import { QuizStudentModule } from '../quiz-student/quizStudent.module';
import { TeacherSubjectSendQuizComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-send-quiz.component';
import { TeacherSubjectAttendanceComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-attendance.component';
import { TeacherSubjectGradesComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-grades.component';
import { TeacherSubjectBookComponent } from './teacher-subjects/teacher-subject-detail/teacher-subject-book.component';


@NgModule({
  imports: [
    SharedModule,
    TeacherRoutingModule,
    UsersModule,
    SubjectsModule,
    QuizStudentModule,
    
  ],

  declarations: [
    TeacherComponent,
    TeacherHomeComponent,
    
    TeacherSubjectsComponent,
    TeacherSubjectsDetailComponent,
    TeacherSubjectGradesComponent,
    TeacherSubjectCourseComponent,
    TeacherSubjectQuizComponent,
    TeacherSubjectSendQuizComponent,
    TeacherSubjectEvaluationsComponent,
    TeacherSubjectAttendanceComponent,

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
