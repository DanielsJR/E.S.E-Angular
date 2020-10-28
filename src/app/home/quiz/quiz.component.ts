import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Evaluation } from '../../models/evaluation';
import { Quiz, QUIZ_LEVELS } from '../../models/quiz';
import { SUBJECT_NAMES } from '../../models/subject-names';
import { IsLoadingService } from '../../services/isLoadingService.service';
import { QuizStoreService } from '../../services/quiz-store.service';
import { UserLoggedService } from '../../services/user-logged.service';
import { SnackbarService } from '../../shared/snackbars-ref/snackbar.service';

@Component({
  selector: 'nx-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  private _evaluation: Evaluation;

  @Input() set evaluation(evaluation: Evaluation) {
    if (evaluation.quiz) this._evaluation = evaluation;
    if (this._evaluation && this.quizDetailForm) this.buildForm();
  }

  get evaluation() {
    return this._evaluation;
  }

  @Output() closeQuizDetail = new EventEmitter<any>();
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
  quizDetailForm: FormGroup;

  constructor(private quizStoreService: QuizStoreService,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
    private userLoggedService: UserLoggedService,
  ) {
    this.usernameLogged = userLoggedService.getTokenUsername();

  }

  ngOnInit() {
    this.subscriptions.add(this.quizStoreService.isLoadingGetQuizes$
      .subscribe(isLoadding => this.isLoadingService.isLoadingEmit(isLoadding)));

    this.buildForm();
  }

  buildForm() {
    this.quizDetailForm = this.formBuilder.group({
      title: [this.evaluation.quiz.title],
      description: [this.evaluation.quiz.description],
      subjectName: [this.evaluation.subject.name],
      courseName: [this.evaluation.subject.course.name],
    });

  }

  get title() { return this.quizDetailForm.get('title'); }
  get description() { return this.quizDetailForm.get('description'); }
  get subjectName() { return this.quizDetailForm.get('subjectName'); }
  get quizLevel() { return this.quizDetailForm.get('courseName'); }

  closeButton() {
    this.closeQuizDetail.emit(null);
  }

}
