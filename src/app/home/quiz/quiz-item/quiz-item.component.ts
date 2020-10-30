import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { CORRESPOND_ITEM_TYPE, TRUE_FALSE_ITEM_TYPE, MULTIPLE_SELECTION_ITEM_TYPE, INCOMPLETE_TEXT_ITEM_TYPE, CORRESPOND_ITEM_TITLE, INCOMPLETE_TEXT_ITEM_TITLE, MULTIPLE_SELECTION_ITEM_TITLE, TRUE_FALSE_ITEM_TITLE, QUIZ_UPDATE_ERROR, QUIZ_UPDATE_SUCCEED, RESULT_ACTION1, RESULT_CANCELED, RESULT_ERROR, RESULT_SUCCEED } from '../../../app.config';
import { Quiz, TRUE_FALSES } from '../../../models/quiz';
import { QuizStudent } from '../../../models/quiz-student';
import { IsLoadingService } from '../../../services/isLoadingService.service';
import { QuizStoreService } from '../../../services/quiz-store.service';
import { SimpleDialogRefComponent } from '../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SnackbarService } from '../../../shared/snackbars-ref/snackbar.service';

@Component({
  selector: 'nx-quiz-item',
  templateUrl: './quiz-item.component.html',
  styleUrls: ['./quiz-item.component.css']
})
export class QuizItemComponent implements OnInit {

  private _quiz: Quiz | QuizStudent;
  @Input() set quiz(quiz: Quiz | QuizStudent) {
    if (quiz) this._quiz = quiz;
    if (this._quiz && this.itemsForm) this.buildForm();//reset form
  }

  get quiz() {
    return this._quiz;
  }

  @Input() itemType: string;
  @Input() isReadonly: boolean;

  itemsForm: FormGroup;
  panelOpenItems: boolean = false;
  accordionDisplayMode = 'default';

  correspondItemType = CORRESPOND_ITEM_TYPE;
  trueFalseItemType = TRUE_FALSE_ITEM_TYPE;
  multipleSelectionItemType = MULTIPLE_SELECTION_ITEM_TYPE;
  incompleteTextItemType = INCOMPLETE_TEXT_ITEM_TYPE;
  controlItemsArray: FormArray;

  trueFalses = TRUE_FALSES;
  itemTitle: string;
  btnAddDisabled: boolean;

  answers: number[];
  incorrectAnswers: number;
  correctAnswers: number;

  isQuizStudent: boolean;

  constructor(private quizStoreService: QuizStoreService,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
  ) { }


  ngOnInit(): void {
    this.isQuizStudent = !this.isQuiz(this.quiz)
    this.getItemTitle();
    this.buildForm();
  }

  isQuiz(toBeDetermined: any): toBeDetermined is Quiz {
    if ((toBeDetermined as Quiz).author) return true
    return false
  }

  buildForm() {
    this.itemsForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.controlItemsArray = <FormArray>this.itemsForm.controls.items;
    this.initializeCorrectIncorrectAnswers();
    this.setItems(this.quiz);
  }

  get items() { return this.itemsForm.get('items'); }

  initializeCorrectIncorrectAnswers() {
    this.incorrectAnswers = 0;
    this.correctAnswers = 0;
  }

  setItems(quiz: Quiz) {
    switch (this.itemType) {

      case this.correspondItemType:
        this.setCorrespondItems(quiz);
        break;

      case this.trueFalseItemType:
        this.setTrueFalseItems(quiz);
        break;

      case this.multipleSelectionItemType:
        this.setMultipleSelectionItems(quiz);
        break;

      case this.incompleteTextItemType:
        this.setIncompleteTextItems(quiz);
        break;
    }

  }

  setCorrespondItems(quiz: Quiz) {
    quiz.correspondItems.forEach(item => {
      (item.correct) ? this.correctAnswers++ : this.incorrectAnswers++;

      this.controlItemsArray.push(this.formBuilder.group({
        item: [item.item, [Validators.required]],
        correspond: [item.correspond, [Validators.required]],
        open: [this.panelOpenItems],
        correct: [item.correct],
      }));
    });

    this.answers = [this.correctAnswers, this.incorrectAnswers];
  }

  setTrueFalseItems(quiz: Quiz) {
    quiz.trueFalseItems.forEach(item => {
      (item.correct) ? this.correctAnswers++ : this.incorrectAnswers++;

      this.controlItemsArray.push(this.formBuilder.group({
        sentence: [item.sentence, [Validators.required]],
        answer: [item.answer, [Validators.required]],
        open: [this.panelOpenItems],
        correct: [item.correct],
      }));
    });

    this.answers = [this.correctAnswers, this.incorrectAnswers];
  }

  setMultipleSelectionItems(quiz: Quiz) {
    quiz.multipleSelectionItems.forEach(item => {
      (item.correct) ? this.correctAnswers++ : this.incorrectAnswers++;

      this.controlItemsArray.push(this.formBuilder.group({
        sentence: [item.sentence, [Validators.required]],
        alternativeA: [item.alternativeA, [Validators.required]],
        alternativeB: [item.alternativeB, [Validators.required]],
        alternativeC: [item.alternativeC, [Validators.required]],
        alternativeD: [item.alternativeD, [Validators.required]],
        answer: [item.answer, [Validators.required]],
        open: [this.panelOpenItems],
        correct: [item.correct],
      }));
    });

    this.answers = [this.correctAnswers, this.incorrectAnswers];

  }

  setIncompleteTextItems(quiz: Quiz) {
    quiz.incompleteTextItems.forEach(item => {
      (item.correct) ? this.correctAnswers++ : this.incorrectAnswers++;

      this.controlItemsArray.push(this.formBuilder.group({
        sentence: [item.sentence, [Validators.required]],
        answer: [item.answer, [Validators.required]],
        open: [this.panelOpenItems],
        correct: [item.correct],
      }));
    });

    this.answers = [this.correctAnswers, this.incorrectAnswers];
  }

  addItem() {
    this.btnAddDisabled = true;
    this.panelOpenItems = true;
    let control = <FormArray>this.itemsForm.controls.items;

    switch (this.itemType) {

      case this.correspondItemType:
        control.push(this.addCorrespondItem());
        break;

      case this.trueFalseItemType:
        control.push(this.addTrueFalseItemItem());
        break;

      case this.multipleSelectionItemType:
        control.push(this.addMultipleSelectionItem());
        break;

      case this.incompleteTextItemType:
        control.push(this.addIncompleteTextItem());
        break;

    }
  }

  addCorrespondItem(): FormGroup {
    let item = this.formBuilder.group({
      item: [null, [Validators.required]],
      correspond: [null, [Validators.required]],
      open: [true],
    });

    return item;
  }

  addTrueFalseItemItem(): FormGroup {
    let item = this.formBuilder.group({
      sentence: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      open: [true],
    });

    return item;
  }

  addMultipleSelectionItem(): FormGroup {
    let item = this.formBuilder.group({
      sentence: [null, [Validators.required]],
      alternativeA: [null, [Validators.required]],
      alternativeB: [null, [Validators.required]],
      alternativeC: [null, [Validators.required]],
      alternativeD: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      open: [true],
    });

    return item;
  }

  addIncompleteTextItem(): FormGroup {
    let item = this.formBuilder.group({
      sentence: [null, [Validators.required]],
      answer: [null, [Validators.required]],
      open: [true],
    });

    return item;
  }

  deleteItemDialog(dialogRef: MatDialogRef<SimpleDialogRefComponent>, index): void {
    dialogRef.afterClosed().subscribe(result => {
      if (result === RESULT_CANCELED) {
        console.log(RESULT_CANCELED);
      } else if (result === RESULT_ACTION1) {
        console.log(RESULT_ACTION1);
        this.prepareEditedQuiz(index);
      } else {
        console.error('no result');
      }
    });
  }

  prepareEditedQuiz(index?) {
    switch (this.itemType) {

      case this.correspondItemType:
        this.saveItems(this.prepareEditedCorrespondItemsQuiz(index));
        break;

      case this.trueFalseItemType:
        this.saveItems(this.prepareEditedTrueFalseItemsQuiz(index));
        break;

      case this.multipleSelectionItemType:
        this.saveItems(this.prepareEditedMultipleSelectionItemsQuiz(index));
        break;

      case this.incompleteTextItemType:
        this.saveItems(this.prepareEditedIncompleteTextItemsQuiz(index));
        break;
    }
  }

  prepareEditedCorrespondItemsQuiz(index?): Quiz {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.correspondItems = this.items.value;
    editedQuiz.correspondItems.forEach(items => {
      items.correspond = items.correspond === "" ? null : items.correspond;
      items.item = items.item === "" ? null : items.item;
    });

    if (index != null) editedQuiz.correspondItems.splice(index, 1);

    return editedQuiz;
  }

  prepareEditedTrueFalseItemsQuiz(index?): Quiz {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.trueFalseItems = this.items.value;
    editedQuiz.trueFalseItems.forEach(items => {
      items.sentence = items.sentence === "" ? null : items.sentence;
      items.answer = items.answer === undefined ? null : items.answer;
    });

    if (index != null) editedQuiz.trueFalseItems.splice(index, 1);

    return editedQuiz;
  }

  prepareEditedMultipleSelectionItemsQuiz(index?): Quiz {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.multipleSelectionItems = this.items.value;
    editedQuiz.multipleSelectionItems.forEach(items => {
      items.sentence = items.sentence === "" ? null : items.sentence;
      items.alternativeA = items.alternativeA === "" ? null : items.alternativeA;
      items.alternativeB = items.alternativeB === "" ? null : items.alternativeB;
      items.alternativeC = items.alternativeC === "" ? null : items.alternativeC;
      items.alternativeD = items.alternativeD === "" ? null : items.alternativeD;
      items.answer = items.answer === undefined ? null : items.answer;
    });

    if (index != null) {
      editedQuiz.multipleSelectionItems.splice(index, 1);
    }

    return editedQuiz;
  }

  prepareEditedIncompleteTextItemsQuiz(index?): Quiz {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.incompleteTextItems = this.items.value;
    editedQuiz.incompleteTextItems.forEach(items => {
      items.sentence = items.sentence === "" ? null : items.sentence;
      items.answer = items.answer === "" ? null : items.answer;
    });

    if (index != null) editedQuiz.incompleteTextItems.splice(index, 1);

    return editedQuiz;
  }

  private saveItems(editedQuiz: Quiz) {
    this.isLoadingService.isLoadingEmit(true);
    this.quizStoreService.update(editedQuiz, editedQuiz.author.username)
      .pipe(finalize(() => {
        this.isLoadingService.isLoadingEmit(false);
      }))
      .subscribe(q => {
        this.quiz = q;
        this.panelOpenItems = false;
        this.btnAddDisabled = false;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR));
  }

  itemsDisableBtnSave(index) {
    let control = <FormArray>this.itemsForm.controls.items;
    return (control.at(index).valid && control.at(index).dirty);
  }

  getItemTitle() {
    switch (this.itemType) {

      case this.correspondItemType:
        this.itemTitle = CORRESPOND_ITEM_TITLE;
        break;

      case this.trueFalseItemType:
        this.itemTitle = TRUE_FALSE_ITEM_TITLE;
        break;

      case this.multipleSelectionItemType:
        this.itemTitle = MULTIPLE_SELECTION_ITEM_TITLE;
        break;

      case this.incompleteTextItemType:
        this.itemTitle = INCOMPLETE_TEXT_ITEM_TITLE;
        break;
    }
  }

  checkAnswerIcon(value: boolean): string {
    return value ? "check" : "close";
  }

  checkAnswerColor(value: boolean): string {
    return value ? "primary" : "warn";
  }

}
