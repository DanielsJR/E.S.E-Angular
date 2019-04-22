import { Injectable } from "../../../node_modules/@angular/core";
import { BehaviorSubject, Subject, Observable } from "../../../node_modules/rxjs";
import { Course } from "../models/course";
import { HttpClient, HttpErrorResponse } from "../../../node_modules/@angular/common/http";
import { finalize } from "../../../node_modules/rxjs/internal/operators/finalize";
import { CourseBackendService } from "./course-backend.service";
import { tap } from "rxjs/internal/operators/tap";
import { User } from "../models/user";
import { IsLoadingService } from "./isLoadingService.service";
import { SubjectStoreService } from "./subject-store.service";
import { map } from "rxjs/operators";



@Injectable({
    providedIn: 'root',
})
export class CourseStoreService {
    private dataStore: { courses: Course[] };
    private coursesSource = <BehaviorSubject<Course[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(private courseBackendService: CourseBackendService, private isLoadingService: IsLoadingService,
        private subjectStoreService: SubjectStoreService, ) {
        this.dataStore = { courses: [] };
    }

    get courses$() {
        return this.coursesSource.asObservable();
    }

    get isLoadingGetCourses$() {
        return this.isLoadingGet.asObservable();
    }

    loadAllCourses(year: string) {
        /*  if (this.coursesSource.getValue().length) {
              console.log(`********GET-Courses-FROM-CACHE********`);
              this.coursesSource.next(this.dataStore.courses);
          } else {*/
        console.log(`********GET-Courses-FROM-BACKEND********`);
        this.isLoadingGet.next(true);
        this.courseBackendService.getCourses(year)
            .pipe(finalize(() => this.isLoadingGet.next(false)))
            .subscribe(data => {
                if (data.length) {
                    this.dataStore.courses = data;
                    this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                } else {
                    data = null;
                    console.error('Lista de Cursos vacia');
                }
            }, error => console.error('error retrieving cursos, ' + error.message)
            );
        //}

    }

    loadOneCourse(name: string) {
        return this.courses$
            .pipe(map(courses => courses.find(course => course.name === name)));
    }

    create(course: Course): Observable<Course> {
        this.isLoadingService.isLoadingTrue();
        return this.courseBackendService.create(course)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.courses.push(data);
                    this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                }, error => console.error('could not create User, ' + error.message)
                ));
    }

    update(course: Course): Observable<Course> {
        this.isLoadingService.isLoadingTrue();
        return this.courseBackendService.update(course)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.courses.findIndex(c => c.id === data.id);
                    if (index != -1) {
                        this.dataStore.courses[index] = data;
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                        this.subjectStoreService.updateCourseInSubjectStore(data);
                    }
                }, err => console.error("Error updating Manager" + err.message)
                ));
    }

    delete(course: Course | string): Observable<Course> {
        return this.courseBackendService.delete(course)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.courses.findIndex((c: Course) => c.id === ((typeof course === 'string') ? course : course.id));
                    if (index != -1) {
                        this.dataStore.courses.splice(index, 1);
                        this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                        this.subjectStoreService.deleteCorseInSubjectStore(course);
                    }
                }, err => console.error("Error deleting Manager" + err.message)
                ));
    }



    //************userStore CHIEF_TEACHER

    //one to one
    updateChiefTeacherInCourseStoreOneToOne(teacher: User) {
        let curso = this.dataStore.courses.find(c => c.chiefTeacher.id === teacher.id);
        if (curso) {
            curso.chiefTeacher = teacher;
            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                this.subjectStoreService.updateTeacherInSubjectStore(teacher);
            }
        } else {
            console.log('not found');
        }
    }

    //one to many
    updateChiefTeacherInCourseStoreOneToMany(teacher: User) {
        if (this.dataStore.courses.find(c => c.chiefTeacher.id === teacher.id)) {

            this.dataStore.courses.forEach((c, index) => {
                if (c.chiefTeacher.id === teacher.id) {
                    c.chiefTeacher = teacher;
                    this.dataStore.courses[index] = c;
                }
            });

            this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            this.subjectStoreService.updateTeacherInSubjectStore(teacher);

        }
        else {
            console.log('not found');
        }
    }



    //************userStore STUDENTS
    //private
    isStudentInACourse(student: User | string, students: User[]): boolean {
        let found = false;
        students.forEach(s => {
            if (s.id === ((typeof student === 'string') ? student : student.id))
                found = true;
        });
        return found;
    }

    //one to one
    updateStudentInCourseStoreOneToOne(student: User) {
        let curso = this.dataStore.courses.find(c => this.isStudentInACourse(student, c.students));
        if (curso) {
            curso.students.forEach((item, index) => {
                if (item.id === student.id) {
                    curso.students[index] = student;
                }
            });

            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
                this.subjectStoreService.updateCourseInSubjectStore(curso);
            }
        }
    }

    //one to many
    updateStudentInCourseStoreOnetoMany(student: User) {
        if (this.dataStore.courses.find(c => this.isStudentInACourse(student, c.students))) {

            this.dataStore.courses.forEach((c, index) => {
                if (this.isStudentInACourse(student, c.students)) {
                    c.students.forEach((item, index) => {
                        if (item.id === student.id) {
                            c.students[index] = student;
                        }
                    });
                    this.dataStore.courses[index] = c;
                    this.subjectStoreService.updateCourseInSubjectStore(c);
                }
            });

            this.coursesSource.next(Object.assign({}, this.dataStore).courses);


        }
    }


    deleteStudentInCourseStoreOneToOne(student: User | string) {
        let curso = this.dataStore.courses.find(c => this.isStudentInACourse(student, c.students));
        if (curso) {
            curso.students.forEach((item, index) => {
                if (item.id === ((typeof student === 'string') ? student : student.id)) {
                    curso.students.splice(index, 1);
                }
            });

            let index = this.dataStore.courses.findIndex(c => c.id === curso.id);
            if (index != -1) {
                this.dataStore.courses[index] = curso;
                this.coursesSource.next(Object.assign({}, this.dataStore).courses);
            }
        }

    }


}