import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { RESULT_CANCELED, RESULT_ACTION1, QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED, RESULT_ERROR, QUIZ_UPDATE_ERROR } from '../../../../../app.config';
import { Quiz } from '../../../../../models/quiz';
import { IsLoadingService } from '../../../../../services/isLoadingService.service';
import { QuizBackendService } from '../../../../../services/quiz-backend.service';
import { SimpleDialogRefComponent } from '../../../../../shared/dialogs/simple-dialog/simple-dialog-ref/simple-dialog-ref.component';
import { SnackbarService } from '../../../../../shared/snackbars-ref/snackbar.service';

@Component({
  selector: 'nx-quiz-correspond-item',
  templateUrl: './quiz-correspond-item.component.html',
  styleUrls: ['./quiz-correspond-item.component.css']
})
export class QuizCorrespondItemComponent implements OnInit, AfterViewInit {

  @Input() quiz: Quiz;

  editCorrespondItemsForm: FormGroup;
  panelOpenCorrespondItems = false;

  accordionDisplayMode = 'default';

  constructor(private quizBackendService: QuizBackendService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder, private snackbarService: SnackbarService,
    private isLoadingService: IsLoadingService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngAfterViewInit() {

  }

  buildForm() {
    this.editCorrespondItemsForm = this.formBuilder.group({
      correspondItems: this.formBuilder.array([]),
      ponderation: 0
    });

    this.setCorrespondItems(this.quiz);
  }

  get correspondItems() { return this.editCorrespondItemsForm.get('correspondItems'); }
  get ponderationCorrespondItems() { return this.editCorrespondItemsForm.get('ponderation').value; }


  setCorrespondItems(quiz: Quiz) {
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    quiz.correspondItems.forEach(ci => {
      control.push(this.formBuilder.group({
        item: [ci.item, [Validators.required]],
        correspond: [ci.correspond, [Validators.required]],
        open: [this.panelOpenCorrespondItems],
      }))
    })

    //this.editCorrespondItemsForm.controls.ponderation.setValue(25);

  }

  addCorrespondItem() {
    this.panelOpenCorrespondItems = true;
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    let correspondItem = this.formBuilder.group({
      item: [null, [Validators.required]],
      correspond: [null, [Validators.required]],
      open: [this.panelOpenCorrespondItems],
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


  saveCorrespondItems(index?) {
    let editedQuiz = Object.assign({}, this.quiz);
    editedQuiz.correspondItems = this.correspondItems.value;
    editedQuiz.correspondItems.forEach(ci => {
      ci.correspond = ci.correspond === "" ? null : ci.correspond;
      ci.item = ci.item === "" ? null : ci.item;
    });

    if (index != null) editedQuiz.correspondItems.splice(index, 1);

    this.isLoadingService.isLoadingTrue();
    this.quizBackendService.update(editedQuiz, this.quiz.author.username)
      .pipe(finalize(() => {
        this.isLoadingService.isLoadingFalse();
        
      }))
      .subscribe(q => {
        this.quiz = q;
        this.panelOpenCorrespondItems = false;
        this.buildForm();
        this.snackbarService.openSnackBar(QUIZ_UPDATE_SUCCEED, RESULT_SUCCEED);
      }, err => this.snackbarService.openSnackBar((err?.error?.errors) ? err.error.errors : QUIZ_UPDATE_ERROR, RESULT_ERROR));
  }

  correspondItemsDisableBtnSave(index) {
    let control = <FormArray>this.editCorrespondItemsForm.controls.correspondItems;
    return (control.at(index).valid && control.at(index).dirty);
  }


}
