import { NgModule } from '@angular/core';
import { StudentHomeComponent } from './student-home/student-home.component';
import { SharedModule } from '../../shared/shared.module';
import { StudentRoutingModule } from './student.routing';
import { StudentComponent } from './student.component';
import { QuizStudentModule } from '../quiz-student/quizStudent.module';
import { StudentSubjectsComponent } from './student-subjects/student-subjects.component';
import { StudentSubjectsDetailComponent } from './student-subjects/student-subjects-detail.component';
import { SubjectsModule } from '../subjects/subjects.module';
import { StudentSubjectCourseComponent } from './student-subjects/student-subject-course.component';
import { StudentSubjectsGradesComponent } from './student-subjects/student-subjects-grades.component';
import { StudentSubjectsQuizComponent } from './student-subjects/student-subjects-quiz/student-subjects-quiz.component';
import { HomeUserModule } from '../home-user/home-user.module';



@NgModule({
  imports: [
    SharedModule,
    StudentRoutingModule,
    QuizStudentModule,
    SubjectsModule,
    HomeUserModule,
  ],

  declarations: [
    StudentComponent,
    StudentHomeComponent,
    StudentSubjectsComponent,
    StudentSubjectsDetailComponent,
    StudentSubjectCourseComponent,
    StudentSubjectsGradesComponent,
    StudentSubjectsQuizComponent,
  ]
  
})
export class StudentModule { }
