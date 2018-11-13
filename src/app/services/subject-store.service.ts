import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { Subject } from "../models/subject";
import { SubjectBackendService } from "./subject-backend.service";



@Injectable({
    providedIn: 'root',
})
export class SubjectStoreService {


    private subjectsSource = <BehaviorSubject<Subject[]>>new BehaviorSubject([]);
    public readonly subjects$ = this.subjectsSource.asObservable();
    private dataStore: { subjects: Subject[] };
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetSubjects$ = this.isLoadingGet.asObservable();


    constructor(private subjectBackendService: SubjectBackendService, private isLoadingService: IsLoadingService) {
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
                    let index = this.dataStore.subjects.findIndex(c => c.id === data.id);
                    if (index != -1) {
                        this.dataStore.subjects[index] = data;
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        console.error("not found in dataStore.subjects");
                    }
                }, err => console.error("Error updating subject" + err.message)
                ));
    }

    delete(subject: Subject | string): Observable<boolean> {
        return this.subjectBackendService.delete(subject)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.subjects.findIndex((s: Subject) => s.id === ((typeof subject === 'string') ? subject : subject.id));
                    if (index != -1) {
                        this.dataStore.subjects.splice(index, 1);
                        this.subjectsSource.next(Object.assign({}, this.dataStore).subjects);
                    } else {
                        console.error("not found in dataStore.subjects");
                    }
                }, err => console.error("Error deleting subject" + err.message)
                ));
    }

}


