import { API_BACKEND_SERVER, URI_QUIZ_STUDENT, URI_USER } from "../app.config";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";
import { QuizStudent } from "../models/quiz-student";
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/internal/operators/retry';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
    providedIn: 'root',
})
export class QuizStudentBackendService {

    private quizURL = API_BACKEND_SERVER + URI_QUIZ_STUDENT;

    constructor(private httpCli: HttpClient) { }


    getQuizes(): Observable<QuizStudent[]> {
        const url = `${this.quizURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<QuizStudent[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`)
                    , err => console.error('Error getting quizes', err.error.exception)));
    }

    create(quiz: QuizStudent): Observable<QuizStudent> {
        const url = `${this.quizURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<QuizStudent>(url, quiz)
            .pipe(
                tap(resp => console.log(`created Quiz id= ${resp.id}`)
                    , err => console.error('Error creating quiz', err.error.exception)));
    }

    update(quiz: QuizStudent): Observable<QuizStudent> {
        const id = quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<QuizStudent>(url, quiz)
            .pipe(
                tap(resp => console.log(`edited quiz id= ${resp.id}`)
                    , err => console.error('Error updating quiz', err.error.exception)));
    }

    delete(quiz: QuizStudent | string): Observable<QuizStudent> {
        const id = (typeof quiz === 'string') ? quiz : quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<QuizStudent>(url)
            .pipe(
                tap(_ => console.log(`deleted quiz id=${id}`)
                    , err => console.error('Error deleting quiz', err.error.exception)));
    }

    getQuizById(id: string): Observable<QuizStudent> {
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<QuizStudent>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched quiz id=${id}`)
                    , err => console.error('Error getting quiz', err.error.exception)));
    }

    getQuizByUserId(id: string): Observable<QuizStudent[]> {
        const url = `${this.quizURL}${URI_USER}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<QuizStudent[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`)
                    , err => console.error('Error getting quizes', err.error.exception)));
    }

}
