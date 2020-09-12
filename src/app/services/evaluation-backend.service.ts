import { Injectable } from "@angular/core";
import { API_BACKEND_SERVER, URI_TITLE, URI_EVALUATION, URI_SUBJECT, URI_TEACHER } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Evaluation } from "../models/evaluation";




@Injectable({
    providedIn: 'root',
})
export class EvaluationBackendService {

    private evaluationURL = API_BACKEND_SERVER + URI_EVALUATION;

    constructor(private httpCli: HttpClient) { }


    getEvaluations(): Observable<Evaluation[]> {
        const url = `${this.evaluationURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Evaluation[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Evaluations: ${resp.length}`)
                    , err => console.error('Error getting evaluations', err.error.exception)));
    }

    create(evaluation: Evaluation): Observable<Evaluation> {
        const url = `${this.evaluationURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Evaluation>(url, evaluation)
            .pipe(
                tap(e => console.log(`created Evaluation title=${e.title}`)
                    , err => console.error('Error creating evaluation', err.error.exception)));
    }

    update(evaluation: Evaluation): Observable<Evaluation> {
        const evaluationId = evaluation.id;
        const url = `${this.evaluationURL}/${evaluationId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Evaluation>(url, evaluation)
            .pipe(
                tap(e => console.log(`edited Evaluation title=${e.title}`)
                    , err => console.error('Error updating evaluation', err.error.exception)));
    }

    delete(evaluation: Evaluation | string): Observable<Evaluation> {
        const evaluationId = (typeof evaluation === 'string') ? evaluation : evaluation.id;
        const url = `${this.evaluationURL}/${evaluationId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Evaluation>(url)
            .pipe(
                tap(e => console.log(`deleted Evaluation id=${e.id}`)
                    , err => console.error('Error deleting evaluation', err.error.exception)));
    }

    getEvaluationById(id: string): Observable<Evaluation> {
        const url = `${this.evaluationURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation>(url)
            .pipe(retry(3),
                tap(e => console.log(`fetched Evaluation id=${e.id}`)
                    , err => console.error('Error getting evaluation', err.error.exception)));
    }

    getEvaluationByTitle(title: string): Observable<Evaluation> {
        const url = `${this.evaluationURL}${URI_TITLE}/${title}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation>(url)
            .pipe(retry(3),
                tap(e => console.log(`fetched Evaluation title=${e.title}`)
                    , err => console.error('Error getting evaluation', err.error.exception)));
    }

    getEvaluationsBySubject(id: string): Observable<Evaluation[]> {
        const url = `${this.evaluationURL}${URI_SUBJECT}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Evaluation: ${resp.length}`)
                    , err => console.error('Error getting evaluations', err.error.exception)));
    }

    getTeacherEvaluationsBySubject(id: string, username: string): Observable<Evaluation[]> {
        const url = `${this.evaluationURL}${URI_SUBJECT}/${id}${URI_TEACHER}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Evaluation: ${resp.length}`)
                    , err => console.error('Error getting evaluations', err.error.exception)));
    }
}
