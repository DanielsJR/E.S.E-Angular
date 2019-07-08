import { Injectable } from "../../../node_modules/@angular/core";
import { API_SERVER, URI_QUIZES } from "../app.config";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";

import { retry } from "../../../node_modules/rxjs/internal/operators/retry";
import { tap } from "../../../node_modules/rxjs/internal/operators/tap";
import { Quiz } from "../models/quiz";


@Injectable({
    providedIn: 'root',
})
export class QuizBackendService {

    private quizURL = API_SERVER + URI_QUIZES;

    constructor(private httpCli: HttpClient) { }


    getQuizes(): Observable<Quiz[]> {
        const url = `${this.quizURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Quiz[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`))
            );
    }

    create(quiz: Quiz): Observable<Quiz> {
        const url = `${this.quizURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Quiz>(url, quiz)
            .pipe(
                tap(resp => console.log(`created Quiz title= ${resp.title}`))
            );
    }

    update(quiz: Quiz): Observable<Quiz> {
        const id = quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Quiz>(url, quiz)
            .pipe(
                tap(resp => console.log(`edited quiz title= ${resp.title}`))
            );
    }

    delete(quiz: Quiz | string): Observable<Quiz> {
        const id= (typeof quiz === 'string') ? quiz : quiz.id;
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Quiz>(url)
            .pipe(
                tap(_ => console.log(`deleted quiz id=${id}`))
            );
    }

    getQuizById(id: string): Observable<Quiz> {
        const url = `${this.quizURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Quiz>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched quiz id=${id}`))
            );
    }

}
