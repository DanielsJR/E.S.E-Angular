import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Quiz, QUIZ_LEVELS } from '../../../../models/quiz';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RESULT_ERROR, RESULT_SUCCEED, QUIZ_UPDATE_SUCCEED, QUIZ_UPDATE_ERROR, QUIZ_GET_ERROR } from '../../../../app.config';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { finalize, take } from 'rxjs/operators';
import { IsLoadingService } from '../../../../services/isLoadingService.service';
import { SUBJECT_NAMES } from '../../../../models/subject-names';
import { MatSelect } from '@angular/material/select';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserLoggedService } from '../../../../services/user-logged.service';
import { rowAnimation } from '../../../../shared/animations/animations';
import { QuizStoreService } from '../../../../services/quiz-store.service';


@Component({
  selector: 'nx-teacher-quizes-detail',
  templateUrl: './teacher-quizes-detail.component.html',
  styleUrls: ['./teacher-quizes-detail.component.css'],
  animations: [rowAnimation]
})
export class TeacherQuizesDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  quiz: Quiz;
  quizLevels = QUIZ_LEVELS;
  subjectNames = SUBJECT_NAMES;

  editDataQuizForm: FormGroup;
  usernameLogged: string;

  @ViewChild('idTitle') idTitle: ElementRef;
  @ViewChild('idDescription') idDescription: ElementRef;
  @ViewChild('idSubjectName') idSubjectName: MatSelect;
  @ViewChild('idQuizLevel') idQuizLevel: MatSelect;

  private subscriptions = new Subscription();
  isLoading: boolean = false;
  quizId: string;

  constructor(private quizStoreService: QuizStoreService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
    private renderer2: Renderer2,
    private userLoggedService: UserLoggedService,
    private cdRef: ChangeDetectorRef,
  ) {
    this.usernameLogged = userLoggedService.getTokenUsername();

  }

  ngOnInit() {
    this.subscriptions.add(this.quizStoreService.isLoadingGetQuizes$
      .subscribe(isLoadding => this.isLoadingService.isLoadingEmit(isLoadding)));
  }

  ngAfterViewInit() {
    this.getQuiz();

    this.cdRef.detectChanges();
  }

  getQuiz() {
    this.subscriptions.add(this.route.paramMap
      .pipe(
        switchMap(params => this.quizStoreService.loadOneQuiz(params.get('id'))))
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

    this.isLoadingService.isLoadingEmit(true);
    this.subscriptions.add(this.quizStoreService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingEmit(false)))
      .subscribe(q => {
        this.quiz = q;
        this.quitFocus();
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR)
      ));
  }

  quitFocus() {
    this.renderer2.selectRootElement('#idTitle').blur();
    this.renderer2.selectRootElement('#idDescription').blur();
    this.idSubjectName._elementRef.nativeElement.blur();
    this.idQuizLevel._elementRef.nativeElement.blur();
  }

}
