import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";

import { Grade } from "../models/grade";
import { GradeBackendService } from "./grade-backend.service";
import { Subject } from "../models/subject";
import { User } from "../models/user";



@Injectable({
    providedIn: 'root',
})
export class GradeStoreService {
    private dataStore: { grades: Grade[], grade: Grade };

    private gradesSource = <BehaviorSubject<Grade[]>>new BehaviorSubject([]);
    public readonly grades$ = this.gradesSource.asObservable();
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);
    isLoadingGetGrades$ = this.isLoadingGet.asObservable();

    constructor(private gradeBackendService: GradeBackendService, private isLoadingService: IsLoadingService) {
        this.dataStore = { grades: [], grade: null };
    }

    loadAllGrades() {
        if (this.gradesSource.getValue().length) {
            console.log(`********GET-Grades-FROM-CACHE********`);
            this.gradesSource.next(this.dataStore.grades);
        } else {
            console.log(`********GET-Grades-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.gradeBackendService.getGrades()
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

    loadOneGrade(title: string) {
        console.log(`********loadOneGrade()-FROM-BACKEND********`);
        this.gradeBackendService.getGradeByTitle(title)
            .subscribe(data => {
                let notFound = true;
                this.dataStore.grades.forEach((item, index) => {
                    if (item.id === data.id) {
                        console.log('found (updates)');
                        this.dataStore.grades[index] = data;
                        notFound = false;
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    }
                });

                if (notFound) {
                    console.log('not found (adds)');
                    this.dataStore.grades.push(data)
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                }


            }, error => console.log('Could not load Grade.'));

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

    //************* */

    updateSubjectInGradeStore(subject: Subject) {
        this.dataStore.grades.forEach((item, index) => {
            if (item.subject.id === subject.id) {
                item.subject = subject;
                this.dataStore.grades[index] = item;
            }
        });
        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
    }

    deleteSubjectInGradeStore(subject: string | Subject): any {
        //throw new Error("Method not implemented.");
        console.error('Method not implemented: deleteSubjectInGradeStore');
    }

    updateStudentInGradeStore(student: User) {
        this.dataStore.grades.forEach((item, index) => {
            if (item.student.id === student.id) {
                item.student = student;
                this.dataStore.grades[index] = item;
            }
        });

        this.gradesSource.next(Object.assign({}, this.dataStore).grades);

    }

    deleteStudentInGradeStore(student: User | string) {
        throw new Error("Method not implemented.");
    }


}


