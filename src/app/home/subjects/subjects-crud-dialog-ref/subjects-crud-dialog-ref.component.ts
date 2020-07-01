import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { startWith, map, finalize, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from '../../../models/subject';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { SubjectName, SUBJECT_NAMES } from '../../../models/subject-names';
import { Avatar } from '../../../models/avatar';
import { UserStoreService } from '../../../services/user-store.service';
import { SubjectStoreService } from '../../../services/subject-store.service';
import { shortNameSecondName } from '../../../shared/functions/shortName';
import { RESULT_CANCELED, RESULT_ERROR, CRUD_TYPE_EDIT, CRUD_TYPE_CREATE, RESULT_SUCCEED, SUBJECT_CREATE_ERROR, SUBJECT_UPDATE_ERROR, SUBJECT_DELETE_ERROR } from '../../../app.config';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar.service';


@Component({
  selector: 'nx-subjects-crud-dialog-ref',
  templateUrl: './subjects-crud-dialog-ref.component.html',
  styleUrls: ['./subjects-crud-dialog-ref.component.css']
})
export class SubjectsCrudDialogRefComponent implements OnInit, OnDestroy {


  teachers$: Observable<User[]>;
  subjectsNames: SubjectName[]; //= SUBJECT_NAMES;
  subjectName: SubjectName;
  subject: Subject;
  teacher: User;
  course: Course;
  avatar: Avatar;

  subjectGroup: FormGroup;
  teacherGroup: FormGroup;

  subjectEditGroup: FormGroup;
  teacherEditGroup: FormGroup;

  subjectsSubscription: Subscription;

  isLoading: boolean = false;

  compareTeacherFn: ((a1: any, a2: any) => boolean) | null = this.compareById;

  constructor(public dialogRef: MatDialogRef<SubjectsCrudDialogRefComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userStoreService: UserStoreService, private subjectStoreService: SubjectStoreService,
    private snackbarService: SnackbarService,
  ) {
    console.log('***DialogSubject*** type: ' + data.type);
    this.subject = this.data.subject;

    this.subjectsSubscription = subjectStoreService.subjects$.subscribe(subjects => {
      let courseSubjectNames = subjects.filter(sj => sj.course.name.indexOf(this.subject.course.name) === 0).map(v => v.name);
      this.subjectsNames = SUBJECT_NAMES.filter(e => courseSubjectNames.indexOf(e.viewValue) < 0);
    });

    this.teachers$ = this.userStoreService.teachers$;
  }

  ngOnInit() {
    if (this.data.type === CRUD_TYPE_CREATE) {
      this.buildCreateForm();
      this.setAvatarCreateDefault();

    } else if (this.data.type === CRUD_TYPE_EDIT) {
      this.subjectName = SUBJECT_NAMES.find(sn => sn.viewValue.indexOf(this.data.subject.name) === 0);
      this.course = this.data.subject.course;
      this.teacher = this.data.subject.teacher;

      this.buildEditForm();
    }

  }

  ngOnDestroy(): void {
    this.subjectsSubscription.unsubscribe();
  }

  buildCreateForm() {
    this.subjectGroup = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.teacherGroup = this.formBuilder.group({
      teacher: ['', [Validators.required]]
    });

  }
  get cName() { return this.subjectGroup.get('name'); }
  get cTeacher() { return this.teacherGroup.get('teacher'); }

  buildEditForm() {
    this.teacherEditGroup = this.formBuilder.group({
      teacher: [this.teacher]
    });

  }
  get eTeacher() { return this.teacherEditGroup.get('teacher'); }

  selectedUser(value: User) {
    this.teacher = value;
  }

  compareById(option: User, selection: User) {
    return (option && selection) && (option.id === selection.id);
  }


  setAvatarCreateDefault(): void {
    if (!this.teacher) {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", `../assets/images/users/default-hombre-teacher.png`, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        let reader = new FileReader();
        let file = xhr.response;
        file.name = `default-hombre-teacher.png`;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.avatar = new Avatar();
          this.avatar.name = file.name;
          this.avatar.type = file.type;
          this.avatar.data = (reader.result as string).split(',')[1];

          //console.log('file.name: ' + file.name)
        };
      };
      xhr.send()
    }
  }

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  create() {
    let subject: Subject = Object.assign({}, this.subject);
    subject.name = this.cName.value.viewValue; //this.subjectName.value;
    subject.teacher = this.cTeacher.value; //this.teacher;
    this.isLoading = true;
    this.subjectStoreService.create(subject)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.dialogRef.close(RESULT_SUCCEED)
        , error => {
          if (error instanceof HttpErrorResponse) {
            this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
          } else {
            this.snackbarService.openSnackBar(SUBJECT_CREATE_ERROR, RESULT_ERROR);
          }
        }

      );
  }

  edit() {
    let subject: Subject = Object.assign({}, this.subject);
    subject.name = this.subjectName.value;
    subject.course = this.course;
    subject.teacher = this.eTeacher.value; //this.teacher;
    this.isLoading = true;
    this.subjectStoreService.update(subject)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.dialogRef.close(RESULT_SUCCEED)
        , error => {
          if (error instanceof HttpErrorResponse) {
            this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
          } else {
            this.snackbarService.openSnackBar(SUBJECT_UPDATE_ERROR, RESULT_ERROR);
          }
        }

      );
  }

  delete() {
    this.isLoading = true;
    this.subjectStoreService.delete(this.subject)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ => this.dialogRef.close(RESULT_SUCCEED)
        , error => {
          if (error instanceof HttpErrorResponse) {
            this.snackbarService.openSnackBar(error.error.message, RESULT_ERROR);
          } else {
            this.snackbarService.openSnackBar(SUBJECT_DELETE_ERROR, RESULT_ERROR);
          }
        }

      );
  }


}
