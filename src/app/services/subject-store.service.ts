import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { Subject } from "../models/subject";
import { SubjectBackendService } from "./subject-backend.service";
import { Course } from "../models/course";
import { User } from "../models/user";
import { GradeStoreService } from "./grade-store.service";
import { map } from "rxjs/internal/operators/map";



@Injectable({
    providedIn: 'root',
})
export class SubjectStoreService {
    private dataStore: { subjects: Subject[] };
    private subjectsSource = <BehaviorSubject<Subject[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(private subjectBackendService: SubjectBackendService, private isLoadingService: IsLoadingService,
        private gradeStoreService: GradeStoreService) {
        this.dataStore = { subjects: [] };
    }

    get subjects$() {
        return this.subjectsSource.asObservable();
    }

    get isLoadingGetSubjects$() {
        return this.isLoadingGet.asObservable();
    }

    loadAllSubjects() {
        if (this.subjectsSource.getValue().length) {
            console.log(`********GET-Subjects-FROM-CACHE********`);
            this.subjectsSource.next(this.dataStore.subjects);
        } else {
            console.log(`********GET-Subjects-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.subjectBackendService.getSubjects()
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.subjects = data;
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        data = null;
                        console.error('Lista de subject vacia');
                    }
                }, error => console.error('error retrieving subjects, ' + error.message)
                );
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
                }, error => {
                    console.error('could not create subject, ' + error.message);
                }
                ));
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
                        this.gradeStoreService.updateSubjectInGradeStore(data);
                    }
                }, err => console.error("Error updating subject" + err.message)
                ));
    }

    delete(subject: Subject | string): Observable<Subject> {
        return this.subjectBackendService.delete(subject)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.subjects.findIndex((s: Subject) => s.id === ((typeof subject === 'string') ? subject : subject.id));
                    if (index != -1) {
                        this.dataStore.subjects.splice(index, 1);
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    }
                }, err => console.error("Error deleting subject" + err.message)
                ));
    }




    //************courseStore
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



