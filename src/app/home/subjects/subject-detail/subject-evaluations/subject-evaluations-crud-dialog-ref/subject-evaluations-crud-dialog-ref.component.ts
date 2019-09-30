
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_ERROR, CRUD_TYPE_DETAIL, CRUD_TYPE_CREATE, CRUD_TYPE_EDIT, DD_MM_YYYY, EVALUATION_CREATE_ERROR, RESULT_SUCCEED, EVALUATION_UPDATE_ERROR, CRUD_TYPE_DELETE, EVALUATION_DELETE_ERROR } from '../../../../../app.config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { EvaluationStoreService } from '../../../../../services/evaluation-store.service';
import { Evaluation } from '../../../../../models/evaluation';
import { EVALUATION_TYPES } from '../../../../../models/evaluation-types';


@Component({
  selector: 'nx-subject-evaluations-crud-dialog-ref',
  templateUrl: './subject-evaluations-crud-dialog-ref.component.html',
  styleUrls: ['./subject-evaluations-crud-dialog-ref.component.css']
})

export class SubjectEvaluationsCrudDialogRefComponent implements OnInit {

  areaRole: string;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  evaluation: Evaluation;

  typeGroup: FormGroup;
  titleGroup: FormGroup;
  dateGroup: FormGroup;

  typeEditGroup: FormGroup;
  titleEditGroup: FormGroup;
  dateEditGroup: FormGroup;

  evaluationTypes = EVALUATION_TYPES;

  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<SubjectEvaluationsCrudDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private evaluationStoreService: EvaluationStoreService) {

    this.areaRole = this.data.areaRole;
    console.log('***EvaluationDialog*** type: ' + data.type);
    this.evaluation = this.data.evaluation;
  }

  ngOnInit() {
    if (this.data.type === CRUD_TYPE_CREATE) this.buildCreateForm();

    if (this.data.type === CRUD_TYPE_EDIT) this.buildEditForm();
  }

  buildCreateForm() {
    this.typeGroup = this.formBuilder.group({
      type: ['', [Validators.required]]
    });

    this.titleGroup = this.formBuilder.group({
      title: ['', [Validators.required]]
    });

    this.dateGroup = this.formBuilder.group({
      date: ['', [Validators.required]]
    });

  }

  get cType() { return this.typeGroup.get('type'); }
  get cTitle() { return this.titleGroup.get('title'); }
  get cDate() { return this.dateGroup.get('date'); }

  buildEditForm() {
    this.typeEditGroup = this.formBuilder.group({
      type: [this.evaluation.type]
    });

    this.titleEditGroup = this.formBuilder.group({
      title: [this.evaluation.title, [Validators.required]]
    });

    this.dateEditGroup = this.formBuilder.group({
      date: [moment(this.evaluation.date, DD_MM_YYYY)],
    });

  }

  get eType() { return this.typeEditGroup.get('type'); }
  get eTitle() { return this.titleEditGroup.get('title'); }
  get eDate() { return this.dateEditGroup.get('date'); }


  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  openDialogEdit() {
    this.dialogRef.close(RESULT_EDIT);
  }

  openDialogDelete() {
    this.dialogRef.close(RESULT_DELETE);
  }

  create() {
    let evaluation: Evaluation = Object.assign({}, this.evaluation);
    evaluation.type = this.cType.value;
    evaluation.title = this.cTitle.value;
    evaluation.date = moment(this.cDate.value).format(DD_MM_YYYY);

    this.isLoading = true;
    this.evaluationStoreService.create(evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_CREATE_ERROR + ' ' + err);
        });
  }

  edit() {
    let evaluation: Evaluation = Object.assign({}, this.evaluation);
    evaluation.type = this.eType.value;
    evaluation.title = this.eTitle.value;
    evaluation.date = moment(this.eDate.value).format(DD_MM_YYYY);

    this.isLoading = true;
    this.evaluationStoreService.update(evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_UPDATE_ERROR + ' ' + err);
        });
  }

  delete() {
    this.isLoading = true;
    this.evaluationStoreService.delete(this.evaluation)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(EVALUATION_DELETE_ERROR + ' ' + err);
        });
  }


}

