import { Component, OnInit, ViewChild, ElementRef, Renderer, Renderer2 } from '@angular/core';
import { QuizBackendService } from '../../../../services/quiz-backend.service';
import { Quiz, TRUE_FALSES, QUIZ_LEVELS } from '../../../../models/quiz';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { RESULT_ERROR, RESULT_CANCELED, RESULT_ACTION1, RESULT_SUCCEED, QUIZ_UPDATE_SUCCEED, QUIZ_UPDATE_ERROR } from '../../../../app.config';
import { SnackbarService } from '../../../../services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, take } from 'rxjs/operators';
import { IsLoadingService } from '../../../../services/isLoadingService.service';
import { MatDialogRef, MatSelect } from '@angular/material';
import { SimpleDialogRefComponent } from '../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SUBJECT_NAMES } from '../../../../models/subject-names';

@Component({
  selector: 'nx-teacher-quizes-detail',
  templateUrl: './teacher-quizes-detail.component.html',
  styleUrls: ['./teacher-quizes-detail.component.css']
})
export class TeacherQuizesDetailComponent implements OnInit {

  quiz: Quiz;

  trueFalses = TRUE_FALSES;
  quizLevels = QUIZ_LEVELS;
  subjectNames = SUBJECT_NAMES;

  editDataQuizForm: FormGroup;

  editCorrespondItemsForm: FormGroup;
  editTrueFalseItemsForm: FormGroup;
  editMultipleSelectionItemsForm: FormGroup;
  editIncompleteTextItemsForm: FormGroup;

  panelOpenCorrespondItems = false;
  panelOpenTrueFalseItems = false;
  panelOpenMultipleSelectionItems = false;
  panelOpenIncompleteTextItems = false;

  matExpansionExpanded = false;


  @ViewChild('idTitle') idTitle: ElementRef;
  @ViewChild('idDescription') idDescription: ElementRef;
  @ViewChild('idSubjectName') idSubjectName: MatSelect;
  @ViewChild('idQuizLevel') idQuizLevel: MatSelect;

  constructor(private quizBackendService: QuizBackendService,
    private route: ActivatedRoute, public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService, private renderer1: Renderer, private renderer2: Renderer2) {

  }

  ngOnInit() {
    this.isLoadingService.isLoadingTrue();
    this.route.paramMap.pipe(
      take(1), // take(1) will complete the observable after it has emitted one value
      switchMap(params =>
        this.quizBackendService.getQuizById(params.get('id'))
      ))
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.buildForm();
      }, error => console.error('error getting quiz ', error.message)
      );

  }

  buildForm() {
    this.editDataQuizForm = this.formBuilder.group({
      title: [this.quiz.title, [Validators.required]],
      description: [this.quiz.description],
      subjectName: [this.quiz.subjectName, [Validators.required]],
      quizLevel: [this.quiz.quizLevel, [Validators.required]],
    });


    this.editCorrespondItemsForm = this.formBuilder.group({
      correspondItems: this.formBuilder.array([]),
    });

    this.editTrueFalseItemsForm = this.formBuilder.group({
      trueFalseItems: this.formBuilder.array([]),
    });

    this.editMultipleSelectionItemsForm = this.formBuilder.group({
      multipleSelectionItems: this.formBuilder.array([]),
    });

    this.editIncompleteTextItemsForm = this.formBuilder.group({
      incompleteTextItems: this.formBuilder.array([]),
    });

    

    this.setCorrespondItems(this.quiz);
    this.setTrueFalseItems(this.quiz);
    this.setMultipleSelectionItems(this.quiz);
    this.setIncompleteTextItems(this.quiz);

    this.panelsClosed();

  }

  get title() { return this.editDataQuizForm.get('title'); }
  get description() { return this.editDataQuizForm.get('description'); }
  get subjectName() { return this.editDataQuizForm.get('subjectName'); }
  get quizLevel() { return this.editDataQuizForm.get('quizLevel'); }

  get correspondItems() { return this.editCorrespondItemsForm.get('correspondItems'); }
  get trueFalseItems() { return this.editTrueFalseItemsForm.get('trueFalseItems'); }
  get multipleSelectionItems() { return this.editMultipleSelectionItemsForm.get('multipleSelectionItems'); }
  get incompleteTextItems() { return this.editIncompleteTextItemsForm.get('incompleteTextItems'); }

  panelsClosed() {
    this.panelOpenCorrespondItems = false;
    this.panelOpenTrueFalseItems = false;
    this.panelOpenMultipleSelectionItems = false;
    this.panelOpenIncompleteTextItems = false;
  }

  setCorrespondItems(quiz: Quiz) {
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    quiz.correspondItems.forEach(ci => {
      control.push(this.formBuilder.group({
        item: [ci.item, [Validators.required]],
        correspond: [ci.correspond, [Validators.required]],
        open: [false],
      }))
    })
  }

  addCorrespondItem() {
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    let correspondItem = this.formBuilder.group({
      item: [null, [Validators.required]],
      correspond: [null, [Validators.required]],
      open: [true],
    });

    control.push(correspondItem);
  }

  deleteCorrespondItem(index) {
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    control.removeAt(index);
    this.saveCorrespondItems();
  }

  deleteCorrespondItemDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>, index): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.saveCorrespondItems(index);
      } else {
        console.error('no result');
      }
    });
  }

  setTrueFalseItems(quiz: Quiz) {
    let control = <FormArray>this.editTrueFalseItemsForm.controls.trueFalseItems;
    quiz.trueFalseItems.forEach(tf => {
      control.push(this.formBuilder.group({
        sentence: [tf.sentence, [Validators.required]],
        answer: [tf.answer, [Validators.required]],
        open: [false],
      }))
    })
  }

  addTrueFalseItem() {
    let control = <FormArray>this.editTrueFalseItemsForm.controls.trueFalseItems;
    control.push(
      this.formBuilder.group({
        sentence: [null, [Validators.required]],
        answer: [null, [Validators.required]],
        open: [true],
      })
    )

  }

  deleteTrueFalseItem(index) {
    let control = <FormArray>this.editTrueFalseItemsForm.controls.trueFalseItems;
    control.removeAt(index);
    this.saveTrueFalseItems();
  }

  deleteTrueFalseItemDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>, index): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.saveTrueFalseItems(index);
      } else {
        console.error('no result');
      }
    });
  }

  setMultipleSelectionItems(quiz: Quiz) {
    let control = <FormArray>this.editMultipleSelectionItemsForm.controls.multipleSelectionItems;
    quiz.multipleSelectionItems.forEach(ms => {
      control.push(this.formBuilder.group({
        sentence: [ms.sentence, [Validators.required]],
        alternativeA: [ms.alternativeA, [Validators.required]],
        alternativeB: [ms.alternativeB, [Validators.required]],
        alternativeC: [ms.alternativeC, [Validators.required]],
        alternativeD: [ms.alternativeD, [Validators.required]],
        answer: [ms.answer, [Validators.required]],
        open: [false],
      }));

    })

  }

  addMultipleSelectionItem() {
    let control = <FormArray>this.editMultipleSelectionItemsForm.controls.multipleSelectionItems;
    control.push(
      this.formBuilder.group({
        sentence: [null, [Validators.required]],
        alternativeA: [null, [Validators.required]],
        alternativeB: [null, [Validators.required]],
        alternativeC: [null, [Validators.required]],
        alternativeD: [null, [Validators.required]],
        answer: [null, [Validators.required]],
        open: [true],
      })
    )
  }

  deleteMultipleSelectionItem(index) {
    let control = <FormArray>this.editMultipleSelectionItemsForm.controls.multipleSelectionItems;
    control.removeAt(index);
    this.saveMultipleSelectionItems();
  }

  deleteMultipleSelectionItemDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>, index): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.saveMultipleSelectionItems(index);
      } else {
        console.error('no result');
      }
    });
  }

  setIncompleteTextItems(quiz: Quiz) {
    let control = <FormArray>this.editIncompleteTextItemsForm.controls.incompleteTextItems;
    quiz.incompleteTextItems.forEach(it => {
      control.push(this.formBuilder.group({
        sentence: [it.sentence, [Validators.required]],
        answer: [it.answer, [Validators.required]],
        open: [false],
      }))
    })
  }

  addIncompleteTextItem() {
    let control = <FormArray>this.editIncompleteTextItemsForm.controls.incompleteTextItems;
    control.push(
      this.formBuilder.group({
        sentence: [null, [Validators.required]],
        answer: [null, [Validators.required]],
        open: [true],
      })
    )

  }

  deleteIncompleteTextItem(index) {
    let control = <FormArray>this.editIncompleteTextItemsForm.controls.incompleteTextItems;
    control.removeAt(index);
    this.saveIncompleteTextItems();
  }

  deleteIncompleteTextItemDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>, index): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.saveIncompleteTextItems(index);
      } else {
        console.error('no result');
      }
    });
  }

  saveDataQuiz() {
    let editedQuiz = Object.assign({}, this.quiz);

    editedQuiz.title = (this.title.value === "") ? null : this.title.value;
    editedQuiz.description = (this.description.value === "") ? null : this.description.value;
    editedQuiz.subjectName = this.subjectName.value;
    editedQuiz.quizLevel = this.quizLevel.value;

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz)
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
      });
  }

  quitFocus() {
    this.renderer2.selectRootElement('#idTitle').blur();
    this.renderer2.selectRootElement('#idDescription').blur();
    this.idSubjectName._elementRef.nativeElement.blur();
    this.idQuizLevel._elementRef.nativeElement.blur();
  }

  saveCorrespondItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.correspondItems = this.correspondItems.value;
    editedQuiz.correspondItems.forEach(ci => {
      ci.correspond = ci.correspond === "" ? null : ci.correspond;
      ci.item = ci.item === "" ? null : ci.item;
    });

    if (index != null) {
      editedQuiz.correspondItems.splice(index, 1);
    }

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

        } else {
          this.snackbarService.openSnackBar(QUIZ_UPDATE_ERROR, RESULT_ERROR);

        }
      });
  }

  saveTrueFalseItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.trueFalseItems = this.trueFalseItems.value;
    editedQuiz.trueFalseItems.forEach(ci => {
      ci.sentence = ci.sentence === "" ? null : ci.sentence;
      ci.answer = ci.answer === undefined ? null : ci.answer;
    });

    if (index != null) {
      editedQuiz.trueFalseItems.splice(index, 1);
    }


    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

        } else {
          this.snackbarService.openSnackBar(QUIZ_UPDATE_ERROR, RESULT_ERROR);

        }
      });
  }

  saveMultipleSelectionItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.multipleSelectionItems = this.multipleSelectionItems.value;
    editedQuiz.multipleSelectionItems.forEach(ci => {
      ci.sentence = ci.sentence === "" ? null : ci.sentence;
      ci.alternativeA = ci.alternativeA === "" ? null : ci.alternativeA;
      ci.alternativeB = ci.alternativeB === "" ? null : ci.alternativeB;
      ci.alternativeC = ci.alternativeC === "" ? null : ci.alternativeC;
      ci.alternativeD = ci.alternativeD === "" ? null : ci.alternativeD;
      ci.answer = ci.answer === undefined ? null : ci.answer;
    });

    if (index != null) {
      editedQuiz.multipleSelectionItems.splice(index, 1);
    }

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

        } else {
          this.snackbarService.openSnackBar(QUIZ_UPDATE_ERROR, RESULT_ERROR);

        }
      });
  }

  saveIncompleteTextItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.incompleteTextItems = this.incompleteTextItems.value;
    editedQuiz.incompleteTextItems.forEach(ci => {
      ci.sentence = ci.sentence === "" ? null : ci.sentence;
      ci.answer = ci.answer === "" ? null : ci.answer;
    });

    if (index != null) {
      editedQuiz.incompleteTextItems.splice(index, 1);
    }

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, error => {
        if (error instanceof HttpErrorResponse) {
          this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);

        } else {
          this.snackbarService.openSnackBar(QUIZ_UPDATE_ERROR, RESULT_ERROR);

        }
      });
  }



}
