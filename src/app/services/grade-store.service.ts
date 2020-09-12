import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";

import { Grade } from "../models/grade";
import { GradeBackendService } from "./grade-backend.service";
import { User } from "../models/user";
import { map } from "rxjs/internal/operators/map";
import { Evaluation } from '../models/evaluation';



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
                    this.dataStore.grades = data;
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    if (data.length == 0) console.error('grade list empty');
                });
        }

    }

    getTeacherGradesBySubject(subjectId: string, username: string) {
        if (this.gradesSource.getValue().length) {
            console.log(`********GET-TeacherGrades-FROM-CACHE********`);
            this.gradesSource.next(this.dataStore.grades);
        } else {
            console.log(`********GET-TeacherGrades-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.gradeBackendService.getTeacherGradesBySubject(subjectId, username)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    this.dataStore.grades = data;
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    if (data.length == 0) console.error('grade list empty');
                });
        }

    }

    getStudentGradesBySubject(subjectId: string, username: string) {
        if (this.gradesSource.getValue().length) {
            console.log(`********GET-StudentGrades-FROM-CACHE********`);
            this.gradesSource.next(this.dataStore.grades);
        } else {
            console.log(`********GET-StudentGrades-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.gradeBackendService.getStudentGradesBySubject(subjectId, username)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    this.dataStore.grades = data;
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    if (data.length == 0) console.error('grade list empty');
                });
        }

    }

    loadOneGrade(id: string) {
        return this.grades$
            .pipe(map(grades => grades.find(g => g.id === id)));
    }

    create(grade: Grade, teacherUsername: string): Observable<Grade> {
        this.isLoadingService.isLoadingTrue();
        return this.gradeBackendService.create(grade, teacherUsername)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.grades.push(data);
                    this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                }));
    }

    update(grade: Grade, teacherUsername: string): Observable<Grade> {
        this.isLoadingService.isLoadingTrue();
        return this.gradeBackendService.update(grade, teacherUsername)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.grades.findIndex(g => g.id === data.id);
                    if (index != -1) {
                        this.dataStore.grades[index] = data;
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    }

                }));
    }

    delete(grade: Grade | string, teacherUsername: string): Observable<Grade> {
        return this.gradeBackendService.delete(grade, teacherUsername)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.grades.findIndex((g: Grade) => g.id === ((typeof grade === 'string') ? grade : grade.id));
                    if (index != -1) {
                        this.dataStore.grades.splice(index, 1);
                        this.gradesSource.next(Object.assign({}, this.dataStore).grades);
                    }
                }));
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

    updateEvaluationInGradeStore(evaluation: Evaluation) {
        if (this.dataStore.grades.find(g => g.evaluation.id === evaluation.id)) {
            this.dataStore.grades.forEach((item, index) => {
                if (item.evaluation.id === evaluation.id) {
                    item.evaluation = evaluation;
                    this.dataStore.grades[index] = item;
                }
            });
            this.gradesSource.next(Object.assign({}, this.dataStore).grades);
        }


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


