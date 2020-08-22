
import * as moment from 'moment';
import { finalize, switchMap, take } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_ERROR, CRUD_TYPE_DETAIL, CRUD_TYPE_CREATE, CRUD_TYPE_EDIT, DD_MM_YYYY, EVALUATION_CREATE_ERROR, RESULT_SUCCEED, EVALUATION_UPDATE_ERROR, CRUD_TYPE_DELETE, EVALUATION_DELETE_ERROR } from '../../../../../app.config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EvaluationStoreService } from '../../../../../services/evaluation-store.service';
import { Evaluation } from '../../../../../models/evaluation';
import { EVALUATION_TYPES } from '../../../../../models/evaluation-types';
import { Quiz } from '../../../../../models/quiz';
import { UserLoggedService } from '../../../../../services/user-logged.service';
import { QuizBackendService } from '../../../../../services/quiz-backend.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'nx-subject-evaluations-crud-dialog-ref',
  templateUrl: './subject-evaluations-crud-dialog-ref.component.html',
  styleUrls: ['./subject-evaluations-crud-dialog-ref.component.css']
})

export class SubjectEvaluationsCrudDialogRefComponent implements OnInit, OnDestroy {

  areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  evaluation: Evaluation;

  typeGroup: FormGroup;
  quizGroup: FormGroup;
  titleGroup: FormGroup;
  dateGroup: FormGroup;

  typeEditGroup: FormGroup;
  quizEditGroup: FormGroup;
  titleEditGroup: FormGroup;
  dateEditGroup: FormGroup;

  evaluationTypes = EVALUATION_TYPES;
  quizes: Quiz[] = [];
  quizesSubscription: Subscription;

  isLoading: boolean = false;
  isLoadingSpiner: boolean = false;
  quizEnable = false;

  compareQuizFn: ((a1: any, a2: any) => boolean) | null = this.compareById;


  constructor(public dialogRef: MatDialogRef<SubjectEvaluationsCrudDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private evaluationStoreService: EvaluationStoreService,
    private userLoggedService: UserLoggedService, private quizBackendService: QuizBackendService,) {

    this.areaRole = this.data.areaRole;
    console.log('***EvaluationDialog*** type: ' + data.type);
    this.evaluation = this.data.evaluation;
  }

  ngOnInit() {
    if (this.data.type === CRUD_TYPE_CREATE) {
      this.buildCreateForm();
    }

    if (this.data.type === CRUD_TYPE_EDIT) {
      if (this.data.evaluation.quiz) this.quizEnable = true;
      this.buildEditForm();
    }

    this.getQuizes();
  }

  ngOnDestroy(): void {
    this.quizesSubscription.unsubscribe();
  }

  getQuizes() {
    this.isLoadingSpiner = true;
    this.quizesSubscription = this.userLoggedService.userLogged$
      .pipe(
        switchMap(user => this.quizBackendService.getQuizByUserId(user.id)),
        take(1),
        finalize(() => setTimeout(() => this.isLoadingSpiner = false))
      )
      .subscribe(qs => this.quizes = qs);
  }


  buildCreateForm() {
    this.typeGroup = this.formBuilder.group({
      type: ['', [Validators.required]],
      quiz: ['', [Validators.required]],
    });


    this.titleGroup = this.formBuilder.group({
      title: ['', [Validators.required]]
    });

    this.dateGroup = this.formBuilder.group({
      date: ['', [Validators.required]]
    });

  }

  get cType() { return this.typeGroup.get('type'); }
  get cQuiz() { return this.typeGroup.get('quiz'); }
  get cTitle() { return this.titleGroup.get('title'); }
  get cDate() { return this.dateGroup.get('date'); }

  buildEditForm() {
    this.typeEditGroup = this.formBuilder.group({
      type: [this.evaluation.type],
      quiz: [this.evaluation.quiz],
    });

    this.titleEditGroup = this.formBuilder.group({
      title: [this.evaluation.title, [Validators.required]]
    });

    this.dateEditGroup = this.formBuilder.group({
      date: [moment(this.evaluation.date, DD_MM_YYYY)],
    });

  }

  get eType() { return this.typeEditGroup.get('type'); }
  get eQuiz() { return this.typeEditGroup.get('quiz'); }
  get eTitle() { return this.titleEditGroup.get('title'); }
  get eDate() { return this.dateEditGroup.get('date'); }

  selectedEvaluationType(evaluationViewValue) {
    if (evaluationViewValue === 'Prueba' || evaluationViewValue === 'Exámen') {
      this.cQuiz.reset();
      this.cQuiz.enable();
      this.titleGroup.reset();
      this.quizEnable = true;

    } else {
      this.cQuiz.reset();
      this.cQuiz.disable();
      this.titleGroup.reset();
      this.quizEnable = false;
    }

  }

  selectedEvaluationTypeEdit(evaluationViewValue) {
    if (evaluationViewValue === 'Prueba' || evaluationViewValue === 'Exámen') {
      this.eQuiz.reset();
      this.eQuiz.enable();
      this.titleEditGroup.reset();
      this.quizEnable = true;

    } else {
      this.eQuiz.reset();
      this.eQuiz.disable();
      this.titleEditGroup.reset();
      this.quizEnable = false;
    }

  }

  selectedQuiz(quiz) {
    this.cTitle.setValue(quiz.title);
    this.cTitle.markAsDirty();
    //this.cTitle.disable();
  }

  selectedQuizEdit(quiz) {
    this.eTitle.setValue(quiz.title);
    this.eTitle.markAsDirty();
    //this.cTitle.disable();
  }

  compareById(option: Quiz, selection: Quiz) {
    return (option && selection) && (option.id === selection.id);
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  openDialogEdit() {
    this.dialogRef.close(RESULT_EDIT);
  }

  openDialogDelete() {
    this.dialogRef.close(RESULT_DELETE);
  }

  create() {
    let evaluation: Evaluation = Object.assign({}, this.evaluation);
    evaluation.type = this.cType.value;
    evaluation.quiz = this.cQuiz.value;
    evaluation.title = this.cTitle.value;
    evaluation.date = moment(this.cDate.value).format(DD_MM_YYYY);

    this.isLoading = true;
    this.evaluationStoreService.create(evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_CREATE_ERROR + ' ' + err);
        });
  }

  edit() {
    let evaluation: Evaluation = Object.assign({}, this.evaluation);
    evaluation.type = this.eType.value;
    evaluation.quiz = this.eQuiz.value;
    evaluation.title = this.eTitle.value;
    evaluation.date = moment(this.eDate.value).format(DD_MM_YYYY);

    this.isLoading = true;
    this.evaluationStoreService.update(evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_UPDATE_ERROR + ' ' + err);
        });
  }

  delete() {
    this.isLoading = true;
    this.evaluationStoreService.delete(this.evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_DELETE_ERROR + ' ' + err);
        });
  }


}

