import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RESULT_CANCELED, RESULT_ACTION1, QUIZ_UPDATE_ERROR, QUIZ_UPDATE_SUCCEED, RESULT_ERROR, RESULT_SUCCEED } from '../../../../../app.config';
import { Quiz, TRUE_FALSES } from '../../../../../models/quiz';
import { IsLoadingService } from '../../../../../services/isLoadingService.service';
import { QuizBackendService } from '../../../../../services/quiz-backend.service';
import { SimpleDialogRefComponent } from '../../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SnackbarService } from '../../../../../shared/snackbars-ref/snackbar.service';

@Component({
  selector: 'nx-quiz-true-false-item',
  templateUrl: './quiz-true-false-item.component.html',
  styleUrls: ['./quiz-true-false-item.component.css']
})
export class QuizTrueFalseItemComponent implements OnInit {

  @Input() quiz: Quiz;

  trueFalses = TRUE_FALSES;
  editTrueFalseItemsForm: FormGroup;
  panelOpenTrueFalseItems = false;

  accordionDisplayMode = 'default';

  constructor(private quizBackendService: QuizBackendService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editTrueFalseItemsForm = this.formBuilder.group({
      trueFalseItems: this.formBuilder.array([]),
      ponderation: 0
    });

    this.setTrueFalseItems(this.quiz);
    //this.openClosePanels(false);
  }

  get trueFalseItems() { return this.editTrueFalseItemsForm.get('trueFalseItems'); }

  setTrueFalseItems(quiz: Quiz) {
    let control = <FormArray>this.editTrueFalseItemsForm.controls.trueFalseItems;
    quiz.trueFalseItems.forEach(tf => {
      control.push(this.formBuilder.group({
        sentence: [tf.sentence, [Validators.required]],
        answer: [tf.answer, [Validators.required]],
        open: [this.panelOpenTrueFalseItems],
      }))
    })

    //this.editTrueFalseItemsForm.controls.ponderation.setValue(25);
  }

  addTrueFalseItem() {
    this.panelOpenTrueFalseItems = true;
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

  saveTrueFalseItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.trueFalseItems = this.trueFalseItems.value;
    editedQuiz.trueFalseItems.forEach(ci => {
      ci.sentence = ci.sentence === "" ? null : ci.sentence;
      ci.answer = ci.answer === undefined ? null : ci.answer;
    });

    if (index != null) editedQuiz.trueFalseItems.splice(index, 1);

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.panelOpenTrueFalseItems = false;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR)
      );
  }

  trueFalseItemsDisableBtnSave(index) {
    let control = <FormArray>this.editTrueFalseItemsForm.controls.trueFalseItems;
    return (control.at(index).valid && control.at(index).dirty);
  }


}
