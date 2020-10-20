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
  selector: 'nx-quiz-multiple-selection-item',
  templateUrl: './quiz-multiple-selection-item.component.html',
  styleUrls: ['./quiz-multiple-selection-item.component.css']
})
export class QuizMultipleSelectionItemComponent implements OnInit {

  @Input() quiz: Quiz;

  editMultipleSelectionItemsForm: FormGroup;
  panelOpenMultipleSelectionItems = false;

  accordionDisplayMode = 'default';

  constructor(private quizBackendService: QuizBackendService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.editMultipleSelectionItemsForm = this.formBuilder.group({
      multipleSelectionItems: this.formBuilder.array([]),
      ponderation: 0
    });

    this.setMultipleSelectionItems(this.quiz);
  }

  get multipleSelectionItems() { return this.editMultipleSelectionItemsForm.get('multipleSelectionItems'); }

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
        open: [this.panelOpenMultipleSelectionItems],
      }));

    })

    //this.editMultipleSelectionItemsForm.controls.ponderation.setValue(25);

  }

  addMultipleSelectionItem() {
    this.panelOpenMultipleSelectionItems = true;
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
    this.quizBackendService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => this.isLoadingService.isLoadingFalse()))
      .subscribe(q => {
        this.quiz = q;
        this.panelOpenMultipleSelectionItems = false;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR));
  }

}
