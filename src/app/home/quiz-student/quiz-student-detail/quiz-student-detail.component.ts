import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Grade } from '../../../models/grade';
import { QuizStudent } from '../../../models/quiz-student';
import { Subscription } from 'rxjs/internal/Subscription';
import { SessionStorageService } from '../../../services/session-storage.service';


@Component({
  selector: 'nx-quiz-student-detail',
  templateUrl: './quiz-student-detail.component.html',
  styleUrls: ['./quiz-student-detail.component.css']
})
export class QuizStudentDetailComponent implements OnInit {

  quizStudentDetailForm: FormGroup;
  
  colorGrade: string;
  isDark: boolean;

  isThemeDarkSubscription: Subscription;

  quizStudent: QuizStudent;
  private _grade: Grade;

  @Input() set grade(grade: Grade) {
    if (grade.quizStudent) {
      this._grade = grade;
      this.quizStudent = grade.quizStudent;
    };
    if (this._grade && this.quizStudentDetailForm) this.buildForm();
  }

  get grade() {
    return this._grade;
  }

  @Output()
  closeQuizStudentDetail = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, public sanitizer: DomSanitizer, private sessionStorage: SessionStorageService) { }

  ngOnInit() {
    this.buildForm();
    this.isThemeDarkSubscription = this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark);
  }

  buildForm() {
    this.quizStudentDetailForm = this.formBuilder.group({
      title: [this.grade.evaluation.quiz.title],
      //description: [this.grade.evaluation.quiz.description],
      subjectName: [this.grade.evaluation.subject.name],
      courseName: [this.grade.evaluation.subject.course.name],
    });
  }

  get title() { return this.quizStudentDetailForm.get('title'); }
  //get description() { return this.quizStudentDetailForm.get('description'); }
  get subjectName() { return this.quizStudentDetailForm.get('subjectName'); }
  get quizLevel() { return this.quizStudentDetailForm.get('courseName'); }

  closeButton() {
    this.closeQuizStudentDetail.emit(null);
  }

}

