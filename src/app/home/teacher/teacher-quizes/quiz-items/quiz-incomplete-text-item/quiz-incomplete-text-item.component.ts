import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RESULT_CANCELED, RESULT_ACTION1, QUIZ_UPDATE_ERROR, QUIZ_UPDATE_SUCCEED, RESULT_ERROR, RESULT_SUCCEED } from '../../../../../app.config';
import { Quiz } from '../../../../../models/quiz';
import { IsLoadingService } from '../../../../../services/isLoadingService.service';
import { QuizBackendService } from '../../../../../services/quiz-backend.service';
import { SimpleDialogRefComponent } from '../../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SnackbarService } from '../../../../../shared/snackbars-ref/snackbar.service';

@Component({
  selector: 'nx-quiz-incomplete-text-item',
  templateUrl: './quiz-incomplete-text-item.component.html',
  styleUrls: ['./quiz-incomplete-text-item.component.css']
})
export class QuizIncompleteTextItemComponent implements OnInit {

  @Input() quiz: Quiz;

  editIncompleteTextItemsForm: FormGroup;
  panelOpenIncompleteTextItems = false;

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
    this.editIncompleteTextItemsForm = this.formBuilder.group({
      incompleteTextItems: this.formBuilder.array([]),
      ponderation: 0
    });

    this.setIncompleteTextItems(this.quiz);

  }

  get incompleteTextItems() { return this.editIncompleteTextItemsForm.get('incompleteTextItems'); }

  setIncompleteTextItems(quiz: Quiz) {
    let control = <FormArray>this.editIncompleteTextItemsForm.controls.incompleteTextItems;
    quiz.incompleteTextItems.forEach(it => {
      control.push(this.formBuilder.group({
        sentence: [it.sentence, [Validators.required]],
        answer: [it.answer, [Validators.required]],
        open: [this.panelOpenIncompleteTextItems],
      }))
    })

    //this.editIncompleteTextItemsForm.controls.ponderation.setValue(25);
  }

  addIncompleteTextItem() {
    this.panelOpenIncompleteTextItems = true;
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

  saveIncompleteTextItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.incompleteTextItems = this.incompleteTextItems.value;
    editedQuiz.incompleteTextItems.forEach(ci => {
      ci.sentence = ci.sentence === "" ? null : ci.sentence;
      ci.answer = ci.answer === "" ? null : ci.answer;
    });

    if (index != null) editedQuiz.incompleteTextItems.splice(index, 1);

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.panelOpenIncompleteTextItems = false;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR));
  }

  incompleteTextItemsDisableBtnSave(index) {
    let control = <FormArray>this.editIncompleteTextItemsForm.controls.incompleteTextItems;
    return (control.at(index).valid && control.at(index).dirty);
  }

}
