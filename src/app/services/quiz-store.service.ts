import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Quiz } from '../models/quiz';
import { IsLoadingService } from './isLoadingService.service';
import { QuizBackendService } from './quiz-backend.service';




@Injectable({
    providedIn: 'root',
})
export class QuizStoreService {
    private dataStore: { quizes: Quiz[] };
    private quizesSource = <BehaviorSubject<Quiz[]>>new BehaviorSubject(null);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(
        private quizBackendService: QuizBackendService,
        private isLoadingService: IsLoadingService
    ) {
        this.dataStore = { quizes: [] };
    }

    get quizes$() {
        return this.quizesSource.asObservable();
    }

    get isLoadingGetQuizes$() {
        return this.isLoadingGet.asObservable();
    }

    getTeacherQuizes(username: string) {
        if (this.quizesSource.getValue()?.length) {
            console.log(`********GET-Quizes-FROM-CACHE********`);
            this.quizesSource.next(this.dataStore.quizes);
        } else {
            console.log(`********GET-Quizes-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.quizBackendService.getTeacherQuizes(username)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    this.dataStore.quizes = data;
                    this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
                    if (data.length == 0) console.error('quiz list empty');
                });
        }

    }


    loadOneQuiz(id: string) {
        return this.quizes$
            .pipe(map(quizes => quizes?.find(q => q.id === id)));
    }

    create(quiz: Quiz, teacherUsername: string): Observable<Quiz> {
        this.isLoadingService.isLoadingEmit(true);
        return this.quizBackendService.create(quiz, teacherUsername)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingEmit(false)),
                tap(data => {
                    this.dataStore.quizes.push(data);
                    this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
                }));
    }

    update(quiz: Quiz, teacherUsername: string): Observable<Quiz> {
        this.isLoadingService.isLoadingEmit(true);
        return this.quizBackendService.update(quiz, teacherUsername)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingEmit(false)),
                tap(data => {
                    let index = this.dataStore.quizes.findIndex(q => q.id === data.id);
                    if (index != -1) {
                         this.dataStore.quizes[index] = data;
                        this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
                    }

                }));
    }

    delete(quiz: Quiz, teacherUsername: string): Observable<Quiz> {
        return this.quizBackendService.delete(quiz, teacherUsername)
            .pipe(
                tap(_ => {
                    let index = this.dataStore.quizes.findIndex((q: Quiz) => q.id === quiz.id);
                    if (index != -1) {
                        this.dataStore.quizes.splice(index, 1);
                        this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
                    }
                }));
    }

    clearStore() {
        console.log("****************Clearing quizStore******************");
        this.dataStore.quizes = [];
        this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
    }

    updateQuizInDataStore(quiz: Quiz): void {
        let index = this.dataStore.quizes.findIndex((q: Quiz) => q.id === quiz.id);

        if ((index != -1)) {
            console.log('found (it updates)');
            this.dataStore.quizes[index] = quiz;
            this.quizesSource.next(Object.assign({}, this.dataStore).quizes);

        } else {
            console.log('not found (it addes)');
            this.dataStore.quizes.push(quiz);
            this.quizesSource.next(Object.assign({}, this.dataStore).quizes);
        }

    }


}


