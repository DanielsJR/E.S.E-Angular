import { API_BACKEND_SERVER, URI_QUIZ, URI_TEACHER, URI_USER } from "../app.config";
import { Quiz } from "../models/quiz";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { retry } from 'rxjs/internal/operators/retry';
import { tap } from 'rxjs/internal/operators/tap';


@Injectable({
    providedIn: 'root',
})
export class QuizBackendService {

    private quizURL = API_BACKEND_SERVER + URI_QUIZ;

    constructor(private httpCli: HttpClient) { }


    getQuizes(): Observable<Quiz[]> {
        const url = `${this.quizURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Quiz[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`)
                    , err => console.error('Error getting Quizes', err?.error?.exception))
            );
    }

    getTeacherQuizes(username: string): Observable<Quiz[]> {
        const url = `${this.quizURL}${URI_TEACHER}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Quiz[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`)
                    , err => console.error('Error getting Quiz', err?.error?.exception))
            );
    }

    create(quiz: Quiz, username: string): Observable<Quiz> {
        const url = `${this.quizURL}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Quiz>(url, quiz)
            .pipe(
                tap(resp => console.log(`created Quiz title= ${resp.title}`)
                    , err => console.error('Error creating Quiz', err?.error?.exception))
            );
    }

    update(quiz: Quiz, username: string): Observable<Quiz> {
        const id = quiz.id;
        const url = `${this.quizURL}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Quiz>(url, quiz)
            .pipe(
                tap(resp => console.log(`edited quiz title= ${resp.title}`)
                    , err => console.error('Error updating Quiz', err?.error?.exception))
            );
    }

    delete(quiz: Quiz, username: string): Observable<Quiz> {
        const id = quiz.id;
        const url = `${this.quizURL}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Quiz>(url)
            .pipe(
                tap(_ => console.log(`deleted quiz id=${id}`)
                    , err => console.error('Error deleting Quiz', err?.error?.exception))
            );

    }

    getTeacherQuizById(id: string, username: string): Observable<Quiz> {
        const url = `${this.quizURL}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Quiz>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched quiz id=${id}`)
                    , err => console.error('Error getting Quiz', err?.error?.exception))
            );
    }

    getQuizByUserId(id: string): Observable<Quiz[]> {
        const url = `${this.quizURL}${URI_USER}${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Quiz[]>(url)
            .pipe(retry(3),
                tap(quizes => console.log(`N° Quizes: ${quizes.length}`)
                    , err => console.error('Error getting Quiz', err?.error?.exception))
            );
    }



}
