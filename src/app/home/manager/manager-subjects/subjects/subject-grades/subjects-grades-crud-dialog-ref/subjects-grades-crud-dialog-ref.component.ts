import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from '../../../../../../models/subject';
import { Course } from '../../../../../../models/course';
import { Avatar } from '../../../../../../models/avatar';
import { UserStoreService } from '../../../../../../services/user-store.service';
import { CourseStoreService } from '../../../../../../services/course-store.service';
import { SubjectStoreService } from '../../../../../../services/subject-store.service';
import { RESULT_CANCELED, RESULT_SUCCESS, RESULT_ERROR, RESULT_EDIT, RESULT_DELETE } from '../../../../../../app.config';
import { Grade } from '../../../../../../models/grade';
import { GradeStoreService } from '../../../../../../services/grade-store.service';
import * as moment from 'moment';



@Component({
  selector: 'nx-subjects-grades-crud-dialog-ref',
  templateUrl: './subjects-grades-crud-dialog-ref.component.html',
  styleUrls: ['./subjects-grades-crud-dialog-ref.component.css']
})
export class SubjectsGradesCrudDialogRefComponent implements OnInit, OnDestroy {

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

  constructor(public dialogRef: MatDialogRef<SubjectsGradesCrudDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private userStoreService: UserStoreService, private courseStoreService: CourseStoreService,
    private subjectStoreService: SubjectStoreService, private gradeStoreService: GradeStoreService, ) {

    console.log('type: ' + data.type);
    if (data.type === 'create') {
      this.grade = this.data.grade;
      this.grade.subject = this.data.subject;
      this.subject = this.data.subject;

    }

    if (data.type === 'detail') {
      this.grade = this.data.grade;
      this.subject = this.data.grade.subject;
    }

    if (data.type === 'edit') {
      this.grade = this.data.grade;
      this.subject = this.data.grade.subject;
    }

  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy(): void {

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
      type: [this.grade.type, [Validators.required]]
    });

    this.titleEditGroup = this.formBuilder.group({
      title: [this.grade.title, [Validators.required]]
    });

    this.dateEditGroup = this.formBuilder.group({
      date: [this.grade.date, [Validators.required]]
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
    this.grade.type = this.cType.value;
    this.grade.title = this.cTitle.value;
    this.grade.date = moment(this.cDate.value).format('DD/MM/YYYY');

    //TODO atomic in backend
    this.grade.subject.course.students.forEach((student, index) => {
      this.grade.student = student;

      this.isLoading = true;
      this.gradeStoreService.create(this.grade)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(_ =>
          this.dialogRef.close(RESULT_SUCCESS)
          , err => {
            this.dialogRef.close(RESULT_ERROR)
            console.error("Error creating grade: " + err);
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
        this.dialogRef.close(RESULT_SUCCESS)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error("Error creating grade: " + err);
        }

      );
  }

  delete() {

  }




}
