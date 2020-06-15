import { Component, OnInit, Inject, OnDestroy, Input } from '@angular/core';
import { Subject } from '../../../../../../models/subject';
import { ROLE_MANAGER, ROLE_TEACHER, RESULT_CANCELED, RESULT_EDIT, RESULT_DELETE, RESULT_ERROR, RESULT_SUCCEED, GRADE_CREATE_ERROR, GRADE_UPDATE_ERROR, DD_MM_YYYY, CRUD_TYPE_CREATE, CRUD_TYPE_DETAIL, CRUD_TYPE_EDIT } from '../../../../../../app.config';
import { Grade } from '../../../../../../models/grade';
import { Course } from '../../../../../../models/course';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Avatar } from '../../../../../../models/avatar';
import { DomSanitizer } from '@angular/platform-browser';
import { GradeStoreService } from '../../../../../../services/grade-store.service';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { SessionStorageService } from '../../../../../../services/session-storage.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'nx-subjects-grades-crud-dialog-ref',
  templateUrl: './subjects-grades-crud-dialog-ref.component.html',
  styleUrls: ['./subjects-grades-crud-dialog-ref.component.css']
})
export class SubjectsGradesCrudDialogRefComponent implements OnInit, OnDestroy {

  areaRole;
  roleManager = ROLE_MANAGER;
  roleTeacher = ROLE_TEACHER;

  grade: Grade;
  course: Course;
  subject: Subject;

  createForm: FormGroup;
  isLoading: boolean = false;

  avatar: Avatar;

  typeGroup: FormGroup;
  titleGroup: FormGroup;
  dateGroup: FormGroup;

  typeEditGroup: FormGroup;
  titleEditGroup: FormGroup;
  dateEditGroup: FormGroup;

  gradeEditGroup: FormGroup;

  student: any;
  colorGrade: string;
  private subscriptions = new Subscription();
  isDark: boolean;

  constructor(public dialogRef: MatDialogRef<SubjectsGradesCrudDialogRefComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private gradeStoreService: GradeStoreService, private sessionStorage: SessionStorageService ) {

    this.areaRole = this.data.areaRole;

    console.log('***DialogGrade*** type: ' + data.type);

    if (data.type === CRUD_TYPE_CREATE) {
      this.grade = this.data.grade;
      this.grade.evaluation.subject = this.data.grade.evaluation.subject;
      this.subject = this.data.grade.evaluation.subject;

    }

    if (data.type === CRUD_TYPE_DETAIL) {
      this.grade = this.data.grade;
      this.subject = this.data.grade.evaluation.subject;
    }

    if (data.type === CRUD_TYPE_EDIT) {
      this.grade = this.data.grade;
      this.subject = this.data.grade.evaluation.subject;
    }

  }

  ngOnInit() {
    this.buildForm();
    this.subscriptions.add(this.sessionStorage.isThemeDark$.subscribe(isDark => this.isDark = isDark));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  buildForm() {

    this.typeGroup = this.formBuilder.group({
      type: ['', [Validators.required]]
    });

    this.titleGroup = this.formBuilder.group({
      title: ['', [Validators.required]]
    });

    this.dateGroup = this.formBuilder.group({
      date: ['', [Validators.required]]
    });


    this.typeEditGroup = this.formBuilder.group({
      type: [this.grade.evaluation.type, [Validators.required]]
    });

    this.titleEditGroup = this.formBuilder.group({
      title: [this.grade.evaluation.title, [Validators.required]]
    });

    this.dateEditGroup = this.formBuilder.group({
      date: [this.grade.evaluation.date, [Validators.required]]
    });

    this.gradeEditGroup = this.formBuilder.group({
      grade: [this.grade.grade, [Validators.required]]
    });

  }



  get cType() { return this.typeGroup.get('type'); }
  get cTitle() { return this.titleGroup.get('title'); }
  get cDate() { return this.dateGroup.get('date'); }

  get eType() { return this.typeEditGroup.get('type'); }
  get eTitle() { return this.titleEditGroup.get('title'); }
  get eDate() { return this.dateEditGroup.get('date'); }

  get eGrade() { return this.gradeEditGroup.get('grade'); }


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
    this.grade.evaluation.type = this.cType.value;
    this.grade.evaluation.title = this.cTitle.value;
    this.grade.evaluation.date = moment(this.cDate.value).format(DD_MM_YYYY);

    //TODO atomic in backend
    this.grade.evaluation.subject.course.students.forEach((student, index) => {
      this.grade.student = student;

      this.isLoading = true;
      this.gradeStoreService.create(this.grade)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(_ =>
          this.dialogRef.close(RESULT_SUCCEED)
          , err => {
            this.dialogRef.close(RESULT_ERROR)
            console.error(GRADE_CREATE_ERROR + ' ' + err);
          }

        );

    });


  }

  edit() {
    let g = this.eGrade.value;
    this.isLoading = true;
    this.grade.grade = g;

    this.gradeStoreService.update(this.grade)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCEED)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error(GRADE_UPDATE_ERROR, ' ', err);
        }

      );
  }

  delete() {

  }


  dinamicColorGrade(grade: Grade) {
    if (grade.grade > 4.0) {
      this.colorGrade = 'gradeColorHigh'
      if (this.isDark) {
        this.colorGrade = 'gradeColorHighDark'
      }
    } else {
      this.colorGrade = 'gradeColorLow'
      if (this.isDark) {
        this.colorGrade = 'gradeColorLowDark'
      }
    }
    return this.colorGrade;
  }

}

