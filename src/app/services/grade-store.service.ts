import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";

import { Grade } from "../models/grade";
import { GradeBackendService } from "./grade-backend.service";
import { Subject } from "../models/subject";
import { User } from "../models/user";
import { map } from "rxjs/internal/operators/map";



@Injectable({
    providedIn: 'root',
})
export class GradeStoreService {
    private dataStore: { grades: Grade[] };
    private gradesSource = <BehaviorSubject<Grade[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(
        private gradeBackendService: GradeBackendService,
        private isLoadingService: IsLoadingService
    ) {
        this.dataStore = { grades: [] };
    }

    get grades$() {
        return this.gradesSource.asObservable();
    }

    get isLoadingGetGrades$() {
        return this.isLoadingGet.asObservable();
    }

    getGradesBySubject(id: string) {
        if (this.gradesSource.getValue().length) {
            console.log(`********GET-Grades-FROM-CACHE********`);
            this.gradesSource.next(this.dataStore.grades);
        } else {
            console.log(`********GET-Grades-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.gradeBackendService.getGradesBySubject(id)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.grades = data;
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    } else {
                        data = null;
                        console.error('Lista de Notas vacia');
                    }
                }, error => console.error('error retrieving Grades, ' + error.message)
                );
        }

    }

    loadOneGrade(id: string) {
        return this.grades$
            .pipe(map(grades => grades.find(g => g.id === id)));
    }

    create(grade: Grade): Observable<Grade> {
        this.isLoadingService.isLoadingTrue();
        return this.gradeBackendService.create(grade)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.grades.push(data);
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                }, error => console.error('could not create Grades, ' + error.message)
                ));
    }

    update(grade: Grade): Observable<Grade> {
        this.isLoadingService.isLoadingTrue();
        return this.gradeBackendService.update(grade)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.grades.findIndex(g => g.id === data.id);
                    if (index != -1) {
                        this.dataStore.grades[index] = data;
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    }

                }, err => console.error("Error updating Grade" + err.message)
                ));
    }

    delete(grade: Grade | string): Observable<Grade> {
        return this.gradeBackendService.delete(grade)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.grades.findIndex((g: Grade) => g.id === ((typeof grade === 'string') ? grade : grade.id));
                    if (index != -1) {
                        this.dataStore.grades.splice(index, 1);
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    }
                }, err => console.error("Error deleting Grade" + err.message)
                ));
    }

    clearStore() {
        console.log("****************Clearing gradeStore******************");
        this.dataStore.grades = [];
        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
    }


    updateGradeInDataStore(grade: Grade): void {
        let index = this.dataStore.grades.findIndex((g: Grade) => g.id === grade.id);

        if ((index != -1)) {
            console.log('found (it updates)');
            this.dataStore.grades[index] = grade;
            this.gradesSource.next(Object.assign({}, this.dataStore).grades);

        } else {
            console.log('not found (it addes)');
            this.dataStore.grades.push(grade);
            this.gradesSource.next(Object.assign({}, this.dataStore).grades);
        }

    }




    //*****subjectStore******** */

    updateSubjectInGradeStore(subject: Subject) {
        /* if (this.dataStore.grades.find(g => g.subject.id === subject.id)) {
             this.dataStore.grades.forEach((item, index) => {
                 if (item.subject.id === subject.id) {
                     item.subject = subject;
                     this.dataStore.grades[index] = item;
                 }
             });
             this.gradesSource.next(Object.assign({}, this.dataStore).grades);
         }
     */

    }

    updateStudentInGradeStore(student: User) {
        if (this.dataStore.grades.find(g => g.student.id === student.id)) {
            this.dataStore.grades.forEach((item, index) => {
                if (item.student.id === student.id) {
                    item.student = student;
                    this.dataStore.grades[index] = item;
                }
            });
            this.gradesSource.next(Object.assign({}, this.dataStore).grades);
        }

    }


}


