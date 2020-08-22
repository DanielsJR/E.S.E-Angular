import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Grade } from '../../models/grade';
import { DomSanitizer } from '@angular/platform-browser';
import { QuizStudent } from '../../models/quiz-student';
import { TRUE_FALSES } from '../../models/quiz';
import { deepCopy } from '../../shared/functions/deepCopy';
import { IsLoadingService } from '../../services/isLoadingService.service';
import { finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';
import { QuizStudentBackendService } from '../../services/quiz-student-backend.service';
import { QUIZ_CREATE_SUCCEED, RESULT_SUCCEED, RESULT_ERROR, QUIZ_CREATE_ERROR, GRADE_CREATE_ERROR, GRADE_CREATE_SUCCEED } from '../../app.config';
import { UserLoggedService } from '../../services/user-logged.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { RxStompService } from '@stomp/ng2-stompjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'nx-quiz-student',
  templateUrl: './quiz-student.component.html',
  styleUrls: ['./quiz-student.component.css']
})
export class QuizStudentComponent implements OnInit, OnDestroy {

  quizStudentDetailForm: FormGroup;

  correspondItemsForm: FormGroup;
  trueFalseItemsForm: FormGroup;
  multipleSelectionItemsForm: FormGroup;
  incompleteTextItemsForm: FormGroup;

  panelOpenCorrespondItems = false;
  panelOpenTrueFalseItems = false;
  panelOpenMultipleSelectionItems = false;
  panelOpenIncompleteTextItems = false;

  trueFalses = TRUE_FALSES;

  private _grade: Grade;

  correspondItemsArray: any;
  btnIndex: number;
  btnSelected: boolean = false;
  btnItem: MatButton;

  quizStudentToSend: QuizStudent;
  student: User;
  private subscriptions = new Subscription();


  @Input() set grade(grade: Grade) {
    if (grade.quizStudent) this._grade = grade;
    if (this._grade && this.quizStudentDetailForm) this.buildForm();
  }

  get grade() {
    return this._grade;
  }

  @Output() quizSent = new EventEmitter<boolean>(false);

  constructor(private formBuilder: FormBuilder, public sanitizer: DomSanitizer, private isLoadingService: IsLoadingService,
    private snackbarService: SnackbarService, private quizStudentBackendService: QuizStudentBackendService,
    private userLoggedService: UserLoggedService, private rxStompService: RxStompService,
  ) { }

  ngOnInit() {
    this.subscriptions.add(this.userLoggedService.userLogged$.subscribe(user => this.student = user));
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  buildForm() {
    this.quizStudentDetailForm = this.formBuilder.group({
      title: [this.grade.evaluation.quiz.title],
      subjectName: [this.grade.evaluation.subject.name],
      courseName: [this.grade.evaluation.subject.course.name],
    });

    this.correspondItemsForm = this.formBuilder.group({
      correspondItems: this.formBuilder.array([]),
    });

    this.trueFalseItemsForm = this.formBuilder.group({
      trueFalseItems: this.formBuilder.array([]),
    });

    this.multipleSelectionItemsForm = this.formBuilder.group({
      multipleSelectionItems: this.formBuilder.array([]),
    });

    this.incompleteTextItemsForm = this.formBuilder.group({
      incompleteTextItems: this.formBuilder.array([]),
    });



    this.setCorrespondItems(this.grade.quizStudent);
    this.setTrueFalseItems(this.grade.quizStudent);
    this.setMultipleSelectionItems(this.grade.quizStudent);
    this.setIncompleteTextItems(this.grade.quizStudent);

    this.panelsClosed();

    this.correspondItemsArray = this.grade.evaluation.quiz.correspondItems.slice();

  }

  get title() { return this.quizStudentDetailForm.get('title'); }
  get subjectName() { return this.quizStudentDetailForm.get('subjectName'); }
  get quizLevel() { return this.quizStudentDetailForm.get('courseName'); }

  get correspondItems() { return this.correspondItemsForm.get('correspondItems'); }
  get trueFalseItems() { return this.trueFalseItemsForm.get('trueFalseItems'); }
  get multipleSelectionItems() { return this.multipleSelectionItemsForm.get('multipleSelectionItems'); }
  get incompleteTextItems() { return this.incompleteTextItemsForm.get('incompleteTextItems'); }



  panelsClosed() {
    this.panelOpenCorrespondItems = false;
    this.panelOpenTrueFalseItems = false;
    this.panelOpenMultipleSelectionItems = false;
    this.panelOpenIncompleteTextItems = false;
  }

  setCorrespondItems(quiz: QuizStudent) {
    let control = <FormArray>this.correspondItemsForm.controls.correspondItems;
    quiz.correspondItems.forEach(ci => {
      control.push(this.formBuilder.group({
        item: [ci.item, [Validators.required]],
        correspond: [ci.correspond, [Validators.required]],
      }))
    })
  }

  selectItem(index, value, btn: MatButton) {
    let control = <FormArray>this.correspondItemsForm.controls.correspondItems;
    //let ci: CorrespondItem =  controls.value[index];

    if (!this.btnSelected) {
      this.btnIndex = index;
      let ci = control.at(index);
      btn._elementRef.nativeElement.classList.remove('mat-stroked-button');
      btn._elementRef.nativeElement.classList.add('mat-raised-button');
      this.btnItem = btn;

      this.btnSelected = true;
      console.log('********ci.value: ', ci.value, ' index: ', index);
    }

  }

  selectCorrespond(value, btn: MatButton) {
    let control = <FormArray>this.correspondItemsForm.controls.correspondItems;
    if (this.btnSelected) {
      let ci = control.at(this.btnIndex);
      ci.get('correspond').setValue(value);

      btn._elementRef.nativeElement.classList.remove('mat-stroked-button');
      btn._elementRef.nativeElement.classList.add('mat-raised-button');

      this.btnItem.disabled = true;
      btn.disabled = true;
      console.log('********ci.value: ', ci.value, ' index: ', this.btnIndex);
      this.btnIndex = null;
      this.btnItem = null;
      this.btnSelected = false;
    }


  }

  setTrueFalseItems(quiz: QuizStudent) {
    let control = <FormArray>this.trueFalseItemsForm.controls.trueFalseItems;
    quiz.trueFalseItems.forEach(tf => {
      control.push(this.formBuilder.group({
        sentence: [tf.sentence],
        answer: [null, [Validators.required]],
        expanded: [true],
      }))
    })
  }

  setMultipleSelectionItems(quiz: QuizStudent) {
    let control = <FormArray>this.multipleSelectionItemsForm.controls.multipleSelectionItems;
    quiz.multipleSelectionItems.forEach(ms => {
      control.push(this.formBuilder.group({
        sentence: [ms.sentence],
        alternativeA: [ms.alternativeA],
        alternativeB: [ms.alternativeB],
        alternativeC: [ms.alternativeC],
        alternativeD: [ms.alternativeD],
        answer: [null, [Validators.required]],
        expanded: [true],
      }));

    })

  }

  setIncompleteTextItems(quiz: QuizStudent) {
    let control = <FormArray>this.incompleteTextItemsForm.controls.incompleteTextItems;
    quiz.incompleteTextItems.forEach(it => {
      control.push(this.formBuilder.group({
        sentence: [it.sentence],
        answer: [null, [Validators.required]],
        expanded: [true],
      }))
    })
  }

  sendQuiz() {
    this.quizStudentToSend = deepCopy(this.grade.quizStudent);
    this.quizStudentToSend.correspondItems = this.correspondItems.value;
    this.quizStudentToSend.trueFalseItems = this.trueFalseItems.value;
    this.quizStudentToSend.multipleSelectionItems = this.multipleSelectionItems.value;
    this.quizStudentToSend.incompleteTextItems = this.incompleteTextItems.value;

    this.isLoadingService.isLoadingTrue();
    this.subscriptions.add(this.quizStudentBackendService.create(this.quizStudentToSend)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(qs => {
        this.snackbarService.openSnackBar('Prueba Enviada', RESULT_SUCCEED);
        this.sendGradeToTeacher(qs);
        this.quizSent.emit(true);

      }, error => {
        this.quizSent.emit(false);
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
        } else {
          this.snackbarService.openSnackBar(QUIZ_CREATE_ERROR, RESULT_ERROR);
        }
      }));
  }

  sendGradeToTeacher(quizStudent: QuizStudent) {
    let nGrade: Grade = deepCopy(this.grade);
    let cId = nGrade.evaluation.subject.course.id;
    let sId = nGrade.student.id;
    let eId = nGrade.evaluation.id;

    nGrade.student = null;
    nGrade.evaluation = null;
    nGrade.quizStudent = quizStudent;
    nGrade.grade = 0;

    this.rxStompService.publish({
      destination: `/app/grade-to-teacher/course/${cId}/evaluation/${eId}/student/${sId}`,
      body: JSON.stringify(nGrade)
    });
  }

}