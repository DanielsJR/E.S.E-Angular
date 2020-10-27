import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../../shared/snackbars-ref/snackbar.service';
import { IsLoadingService } from '../../../../services/isLoadingService.service';
import { Quiz, QUIZ_LEVELS, TRUE_FALSES } from '../../../../models/quiz';
import { RESULT_ERROR, RESULT_SUCCEED, QUIZ_CREATE_SUCCEED, QUIZ_CREATE_ERROR } from '../../../../app.config';
import { UserLoggedService } from '../../../../services/user-logged.service';
import { finalize } from 'rxjs/operators';
import { SUBJECT_NAMES } from '../../../../models/subject-names';
import { Subscription } from 'rxjs/internal/Subscription';
import { QuizStoreService } from '../../../../services/quiz-store.service';

@Component({
  selector: 'nx-teacher-quizes-create',
  templateUrl: './teacher-quizes-create.component.html',
  styleUrls: ['./teacher-quizes-create.component.css']
})
export class TeacherQuizesCreateComponent implements OnInit, OnDestroy {

  quiz: Quiz;

  trueFalses = TRUE_FALSES;
  quizLevels = QUIZ_LEVELS;
  subjectNames = SUBJECT_NAMES;

  createQuizForm: FormGroup;

  panelOpenCorrespondItems = false;
  panelOpenTrueFalseItems = false;
  panelOpenMultipleSelectionItems = false;
  panelOpenIncompleteTextItems = false;

  shareQuiz = false;
  private subscriptions = new Subscription();


  constructor(private quizStoreService: QuizStoreService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService, private userLoggedService: UserLoggedService,) {

  }

  ngOnInit() {
    this.quiz = new Quiz();
    this.subscriptions.add(this.userLoggedService.userLogged$.subscribe(user => this.quiz.author = user));
    this.buildForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildForm() {
    this.createQuizForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      description: [null],
      subjectName: [null, [Validators.required]],
      quizLevel: [null, [Validators.required]],
      correspondItems: this.formBuilder.array([]),
      trueFalseItems: this.formBuilder.array([]),
      multipleSelectionItems: this.formBuilder.array([]),
      incompleteTextItems: this.formBuilder.array([]),
    });

  }

  get title() { return this.createQuizForm.get('title'); }
  get description() { return this.createQuizForm.get('description'); }
  get subjectName() { return this.createQuizForm.get('subjectName'); }
  get quizLevel() { return this.createQuizForm.get('quizLevel'); }

  get correspondItems() { return this.createQuizForm.get('correspondItems'); }
  get trueFalseItems() { return this.createQuizForm.get('trueFalseItems'); }
  get multipleSelectionItems() { return this.createQuizForm.get('multipleSelectionItems'); }
  get incompleteTextItems() { return this.createQuizForm.get('incompleteTextItems'); }

  createQuiz() {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.title = this.title.value;
    editedQuiz.description = this.description.value || null;
    editedQuiz.subjectName = this.subjectName.value;
    editedQuiz.quizLevel = this.quizLevel.value;

    editedQuiz.correspondItems = this.correspondItems.value;
    editedQuiz.trueFalseItems = this.trueFalseItems.value;
    editedQuiz.multipleSelectionItems = this.multipleSelectionItems.value;
    editedQuiz.incompleteTextItems = this.incompleteTextItems.value;

    this.isLoadingService.isLoadingEmit(true);
    this.subscriptions.add(this.quizStoreService.create(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingEmit(false)))
      .subscribe(q => {
        this.quiz = q;
        this.router.navigate(['../detail', q.id], { relativeTo: this.route });
        this.snackbarService.openSnackBar(QUIZ_CREATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_CREATE_ERROR, RESULT_ERROR)
      ));
  }

  gotoQuizes() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
