import { Injectable } from "../../../node_modules/@angular/core";
import { API_SERVER, URI_QUIZES_STUDENT } from "../app.config";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";

import { retry } from "../../../node_modules/rxjs/internal/operators/retry";
import { tap } from "../../../node_modules/rxjs/internal/operators/tap";
import { QuizStudent } from "../models/quiz-student";


@Injectable({
    providedIn: 'root',
})
export class QuizStudentBackendService {

    private quizURL = API_SERVER + URI_QUIZES_STUDENT;

    constructor(private httpCli: HttpClient) { }


    getQuizes(): Observable<QuizStudent[]> {
        const url = `${this.quizURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<QuizStudent[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`))
            );
    }

    create(quiz: QuizStudent): Observable<QuizStudent> {
        const url = `${this.quizURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<QuizStudent>(url, quiz)
            .pipe(
                tap(resp => console.log(`created Quiz id= ${resp.id}`))
            );
    }

    update(quiz: QuizStudent): Observable<QuizStudent> {
        const id = quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<QuizStudent>(url, quiz)
            .pipe(
                tap(resp => console.log(`edited quiz id= ${resp.id}`))
            );
    }

    delete(quiz: QuizStudent | string): Observable<QuizStudent> {
        const id = (typeof quiz === 'string') ? quiz : quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<QuizStudent>(url)
            .pipe(
                tap(_ => console.log(`deleted quiz id=${id}`))
            );
    }

    getQuizById(id: string): Observable<QuizStudent> {
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<QuizStudent>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched quiz id=${id}`))
            );
    }

    getQuizByUserId(id: string): Observable<QuizStudent[]> {
        const url = `${this.quizURL}/user/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<QuizStudent[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`))
            );
    }

}
