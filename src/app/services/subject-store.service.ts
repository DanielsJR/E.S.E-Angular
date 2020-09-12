import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, empty } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { Subject } from "../models/subject";
import { SubjectBackendService } from "./subject-backend.service";
import { Course } from "../models/course";
import { User } from "../models/user";
import { GradeStoreService } from "./grade-store.service";
import { map } from "rxjs/internal/operators/map";
import { UserLoggedService } from "./user-logged.service";
import { switchMap } from "rxjs/internal/operators/switchMap";
import { take } from "rxjs/internal/operators/take";


@Injectable({
    providedIn: 'root',
})
export class SubjectStoreService {

    private dataStore: { subjects: Subject[] };
    private subjectsSource = <BehaviorSubject<Subject[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(
        private subjectBackendService: SubjectBackendService,
        private gradeStoreService: GradeStoreService,
        private isLoadingService: IsLoadingService) {

        this.dataStore = { subjects: [] };
    }

    get subjects$() {
        return this.subjectsSource.asObservable();
    }

    get isLoadingGetSubjects$() {
        return this.isLoadingGet.asObservable();
    }

    loadSubjectsByYear(year: string) {
        if (this.subjectsSource.getValue().length) {
            console.log(`********GET-Subjects-FROM-CACHE********`);
            this.subjectsSource.next(this.dataStore.subjects);
        } else {
            this.isLoadingGet.next(true);
            this.subjectBackendService.getSubjectsByYear(year)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    this.dataStore.subjects = data;
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    if (data.length == 0) console.error('Lista de asignaturas vacia');
                });
        }
    }

    loadSubjectsByTeacherAndYear(username: string, year: string) {
        if (this.subjectsSource.getValue().length) {
            console.log(`********GET-Subjects-FROM-CACHE********`);
            this.subjectsSource.next(this.dataStore.subjects);
        } else {
            this.isLoadingGet.next(true);
            this.subjectBackendService.getSubjectsByTeacherAndYear(username, year)
                .pipe(
                    take(1),
                    finalize(() => this.isLoadingGet.next(false))
                )
                .subscribe(data => {
                    this.dataStore.subjects = data;
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    if (data.length == 0) console.error('Lista de asignaturas vacia');
                });
        }
    }

    loadStudentSubjectsByCourse(courseId: string, username: string) {
        if (this.subjectsSource.getValue().length) {
            console.log(`********GET-Subjects-FROM-CACHE********`);
            this.subjectsSource.next(this.dataStore.subjects);
        } else {
            this.isLoadingGet.next(true);
            this.subjectBackendService.getStudentSubjectsByCourse(courseId, username)
                .pipe(
                    take(1),
                    finalize(() => this.isLoadingGet.next(false))
                )
                .subscribe(data => {
                    this.dataStore.subjects = data;
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    if (data.length == 0) console.error('subject list empty');
                });
        }

    }


    loadOneSubject(id: string) {
        return this.subjects$
            .pipe(map(subjects => subjects.find(subject => subject.id === id)));
    }

    create(subject: Subject): Observable<Subject> {
        this.isLoadingService.isLoadingTrue();
        return this.subjectBackendService.create(subject)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.subjects.push(data);
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                }));
    }

    update(subject: Subject): Observable<Subject> {
        this.isLoadingService.isLoadingTrue();
        return this.subjectBackendService.update(subject)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.subjects.findIndex(s => s.id === data.id);
                    if (index != -1) {
                        this.dataStore.subjects[index] = data;
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                        this.gradeStoreService.updateEvaluationInGradeStore(data);
                    }
                }));
    }

    delete(subject: Subject | string): Observable<Subject> {
        this.isLoadingService.isLoadingTrue();
        return this.subjectBackendService.delete(subject)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(_ => {
                    let index = this.dataStore.subjects.findIndex((s: Subject) => s.id === ((typeof subject === 'string') ? subject : subject.id));
                    if (index != -1) {
                        this.dataStore.subjects.splice(index, 1);
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    }
                }));
    }




    //************courseStore************
    updateTeacherInSubjectStore(teacher: User) {
        if (this.dataStore.subjects.find(s => s.teacher.id === teacher.id)) {
            this.dataStore.subjects.forEach((subject, index) => {
                if (subject.teacher.id === teacher.id) {
                    subject.teacher = teacher;
                    this.dataStore.subjects[index] = subject;
                }
            });
            this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
        }
    }

    updateCourseInSubjectStore(course: Course) {
        if (this.dataStore.subjects.find(s => s.course.id === course.id)) {
            this.dataStore.subjects.forEach((subject, index) => {
                if (subject.course.id === course.id) {
                    subject.course = course;
                    this.dataStore.subjects[index] = subject;
                }
            });
            this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
        }
    }
}



