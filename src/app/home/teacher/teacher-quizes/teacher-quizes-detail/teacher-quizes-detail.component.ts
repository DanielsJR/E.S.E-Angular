import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { QuizBackendService } from '../../../../services/quiz-backend.service';
import { Quiz, TRUE_FALSES, QUIZ_LEVELS, CorrespondItem } from '../../../../models/quiz';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_ACTION1, RESULT_SUCCEED, QUIZ_UPDATE_SUCCEED, QUIZ_UPDATE_ERROR, QUIZ_GET_ERROR } from '../../../../app.config';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, take } from 'rxjs/operators';
import { IsLoadingService } from '../../../../services/isLoadingService.service';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SUBJECT_NAMES } from '../../../../models/subject-names';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MatSelect } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserLoggedService } from '../../../../services/user-logged.service';

@Component({
  selector: 'nx-teacher-quizes-detail',
  templateUrl: './teacher-quizes-detail.component.html',
  styleUrls: ['./teacher-quizes-detail.component.css']
})
export class TeacherQuizesDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  quiz: Quiz;
  trueFalses = TRUE_FALSES;
  quizLevels = QUIZ_LEVELS;
  subjectNames = SUBJECT_NAMES;

  editDataQuizForm: FormGroup;
  /*  editCorrespondItemsForm: FormGroup;
   panelOpenCorrespondItems = true;
   matExpansionExpanded = false;
   accordionDisplayMode = 'default';*/
  usernameLogged: string;

  @ViewChild('idTitle') idTitle: ElementRef;
  @ViewChild('idDescription') idDescription: ElementRef;
  @ViewChild('idSubjectName') idSubjectName: MatSelect;
  @ViewChild('idQuizLevel') idQuizLevel: MatSelect;

  private subscriptions = new Subscription();

  constructor(private quizBackendService: QuizBackendService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
    private renderer2: Renderer2,
    private userLoggedService: UserLoggedService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.isLoadingService.isLoadingTrue();
    this.usernameLogged = userLoggedService.getTokenUsername();

  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getQuiz();
  }

  getQuiz() {
    this.subscriptions.add(this.route.paramMap
      .pipe(
        switchMap(params =>
          this.quizBackendService.getTeacherQuizById(params.get('id'), this.usernameLogged)
        ),
        take(1),
        finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        if (q) {
          this.quiz = q;
          this.buildForm();
        }
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_GET_ERROR, RESULT_ERROR)
      ));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildForm() {
    this.editDataQuizForm = this.formBuilder.group({
      title: [this.quiz.title, [Validators.required]],
      description: [this.quiz.description],
      subjectName: [this.quiz.subjectName, [Validators.required]],
      quizLevel: [this.quiz.quizLevel, [Validators.required]],
    });

  }

  get title() { return this.editDataQuizForm.get('title'); }
  get description() { return this.editDataQuizForm.get('description'); }
  get subjectName() { return this.editDataQuizForm.get('subjectName'); }
  get quizLevel() { return this.editDataQuizForm.get('quizLevel'); }



  saveDataQuiz() {
    let editedQuiz = Object.assign({}, this.quiz);

    editedQuiz.title = (this.title.value === "") ? null : this.title.value;
    editedQuiz.description = (this.description.value === "") ? null : this.description.value;
    editedQuiz.subjectName = this.subjectName.value;
    editedQuiz.quizLevel = this.quizLevel.value;

    this.isLoadingService.isLoadingTrue();
    this.subscriptions.add(this.quizBackendService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.quitFocus();
        //this.editDataQuizForm.reset();
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

        } else {
          this.snackbarService.openSnackBar(QUIZ_UPDATE_ERROR, RESULT_ERROR);

        }
      }));
  }

  quitFocus() {
    this.renderer2.selectRootElement('#idTitle').blur();
    this.renderer2.selectRootElement('#idDescription').blur();
    this.idSubjectName._elementRef.nativeElement.blur();
    this.idQuizLevel._elementRef.nativeElement.blur();
  }

}
