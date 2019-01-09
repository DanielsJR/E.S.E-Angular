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



@Injectable({
    providedIn: 'root',
})
export class SubjectStoreService {


    private subjectsSource = <BehaviorSubject<Subject[]>>new BehaviorSubject([]);
    public readonly subjects$ = this.subjectsSource.asObservable();
    private dataStore: { subjects: Subject[] };
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetSubjects$ = this.isLoadingGet.asObservable();


    constructor(private subjectBackendService: SubjectBackendService, private isLoadingService: IsLoadingService,
        private gradeStoreService: GradeStoreService) {
        this.dataStore = { subjects: [] };
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

    loadOneSubject(name: string) {
        console.log(`********loadOneSubject()-FROM-BACKEND********`);
        if (!this.subjectsSource.getValue().length) this.isLoadingGet.next(true);
        this.subjectBackendService.getSubjectByName(name)
            .pipe(finalize(() => this.isLoadingGet.next(false)))
            .subscribe(data => {
                let notFound = true;

                this.dataStore.subjects.forEach((item, index) => {
                    if (item.id === data.id) {
                        this.dataStore.subjects[index] = data;
                        notFound = false;
                    }
                });

                if (notFound) {
                    this.dataStore.subjects.push(data);
                }

                this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
            }, error => console.log('Could not load subject.'));
    }

    create(subject: Subject): Observable<Subject> {
        return this.subjectBackendService.create(subject)
            .pipe(
                tap(data => {
                    this.dataStore.subjects.push(data);
                    this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                }, error => console.error('could not create subject, ' + error.message)
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
                    let index = this.dataStore.subjects.findIndex((s: Subject) => s.id === ((typeof subject === 'string') ? subject: subject.id));
                    if (index != -1) {
                        this.dataStore.subjects.splice(index, 1);
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                        this.gradeStoreService.deleteSubjectInGradeStore(subject); 
                    }
                }, err => console.error("Error deleting subject" + err.message)
                ));
    }




    //************courseStore
    updateCourseInSubjectStore(course: Course) {

        this.dataStore.subjects.forEach((subject, index) => {
            if (subject.course.id === course.id) {
                subject.course = course;
                this.dataStore.subjects[index] = subject;
            }
        });

        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
    }


    deleteCorseInSubjectStore(course: Course | string) {
        //TODO
        let subject = this.dataStore.subjects.find(s => s.course.id === ((typeof course === 'string') ? course : course.id));
        if (subject) {
            // subject.course
            let index = this.dataStore.subjects.findIndex(s => s.course.id === ((typeof course === 'string') ? course : course.id));
            if (index != -1) {
                //this.dataStore.subjects.splice(index, 1);
                this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
            }
        }
    }

    updateTeacherInSubjectStore(teacher: User) {
        this.dataStore.subjects.forEach((subject, index) => {
            if (subject.teacher.id === teacher.id) {
                subject.teacher = teacher;
                this.dataStore.subjects[index] = subject;
            }
        });
        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);

    }

}



