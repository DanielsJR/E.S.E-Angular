import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RESULT_CANCELED, RESULT_SUCCESS, RESULT_ERROR } from '../../../../app.config';
import { Observable } from 'rxjs';
import { User } from '../../../../models/user';
import { startWith, map, finalize } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UserStoreService } from '../../../../services/user-store.service';
import { Course } from '../../../../models/course';
import { CourseStoreService } from '../../../../services/course-store.service';
import { SUBJECTS_NAMES, SubjectName } from '../../../../models/subjects-name';
import { stringify } from 'querystring';
import { Subject } from '../../../../models/subject';
import { SubjectStoreService } from '../../../../services/subject-store.service';
import { Avatar } from '../../../../models/avatar';
import { shortNameSecondName } from '../../../../shared/functions/shortName';

@Component({
  selector: 'nx-manager-subjects-crud-dialog-ref',
  templateUrl: './manager-subjects-crud-dialog-ref.component.html',
  styleUrls: ['./manager-subjects-crud-dialog-ref.component.css']
})
export class ManagerSubjectsCrudDialogRefComponent implements OnInit {

  filteredTeachers$: Observable<User[]>;
  teachers: User[];
  teacher: User;

  filteredCourses$: Observable<Course[]>;
  courses: Course[];
  course: Course;

  filteredSubjectNames$: Observable<SubjectName[]>;
  subjectsNames = SUBJECTS_NAMES;
  subjectName: SubjectName;

  subject: Subject;

  createForm: FormGroup;
  isLoading: boolean = false;

  avatar: Avatar;

  subjectGroup: FormGroup;
  courseGroup: FormGroup;
  teacherGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<ManagerSubjectsCrudDialogRefComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public sanitizer: DomSanitizer, private formBuilder: FormBuilder,
    private userStoreService: UserStoreService, private courseStoreService: CourseStoreService
    , private subjectStoreService: SubjectStoreService) {

    console.log('type: ' + data.type);
  }

  ngOnInit() {
    this.buildForm();
    if (this.data.type === 'create') this.setAvatarCreateDefault();

    this.filteredSubjectNames$ = this.cName.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.value),
        map(value => value ? this._filterSubjectNames(value) : this.subjectsNames.slice()),
      );


    this.filteredTeachers$ = this.cTeacher.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.firstName),
        map(value => value ? this._filterTeachers(value) : this.teachers.slice()),
      );

    this.userStoreService.teachers$.subscribe(data => this.teachers = data);


    this.filteredCourses$ = this.cCourse.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(value => value ? this._filterCourses(value) : this.courses.slice()),
      );

    this.courseStoreService.courses$.subscribe(data => this.courses = data);

  }

  private _filterSubjectNames(value: string): SubjectName[] {
    const filterValue = value.toLowerCase();
    return this.subjectsNames.filter(sn => sn.value.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTeachers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.teachers.filter(user =>
      (user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase()).indexOf(filterValue) === 0 ||
      user.firstName.toLowerCase().indexOf(filterValue) === 0 || user.lastName.toLowerCase().indexOf(filterValue) === 0
      || shortNameSecondName(user).toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCourses(value: string): Course[] {
    const filterValue = value.toLowerCase();
    return this.courses.filter(course => course.name.toLowerCase().indexOf(filterValue) === 0);
  }

  selectedSubjectName(value: SubjectName) {
    this.subjectName = value;
  }

  selectedUser(value: User) {
    this.teacher = value;
  }

  selectedCourse(value: Course) {
    this.course = value;
  }


  displayTeacher(user?: User): string | undefined {
    return user ? user.firstName + ' ' + user.lastName : undefined;
  }

  displayCourse(course?: Course): string | undefined {
    return course ? course.name : undefined;
  }

  displaySubject(subject?: SubjectName): string | undefined {
    return subject ? subject.viewValue : undefined;
  }


  buildForm() {
    /*  this.createForm = this.formBuilder.group({
        name: [null, [Validators.required]],
        teacher: [null, [Validators.required]],
        course: [null, [Validators.required]]
  
      });  */

    this.subjectGroup = this.formBuilder.group({
      name: ['', [Validators.required]]
    });

    this.courseGroup = this.formBuilder.group({
      course: ['', [Validators.required]]
    });

    this.teacherGroup = this.formBuilder.group({
      teacher: ['', [Validators.required]]
    });
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

  get cName() { return this.subjectGroup.get('name'); }
  get cCourse() { return this.courseGroup.get('course'); }
  get cTeacher() { return this.teacherGroup.get('teacher'); }
 

  cancel(): void {
    this.dialogRef.close(RESULT_CANCELED);
  }

  create() {
    let subject: Subject = new Subject();
    subject.name = this.subjectName.value;
    subject.course = this.course;
    subject.teacher = this.teacher;
    this.isLoading = true;
    this.subjectStoreService.create(subject)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(_ =>
        this.dialogRef.close(RESULT_SUCCESS)
        , err => {
          this.dialogRef.close(RESULT_ERROR)
          console.error("Error creating Subject: " + err);
        }

      );
  }


}
