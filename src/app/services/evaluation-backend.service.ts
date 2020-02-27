import { Injectable } from "@angular/core";
import { API_SERVER, URI_TITLE, URI_EVALUATIONS, URI_SUBJECTS } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Evaluation } from "../models/evaluation";




@Injectable({
    providedIn: 'root',
})
export class EvaluationBackendService {

    private evaluationURL = API_SERVER + URI_EVALUATIONS;

    constructor(private httpCli: HttpClient) { }


    getEvaluations(): Observable<Evaluation[]> {
        const url = `${this.evaluationURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Evaluation[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Evaluations: ${resp.length}`))
            );
    }

    create(evaluation: Evaluation): Observable<Evaluation> {
        const url = `${this.evaluationURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Evaluation>(url, evaluation)
            .pipe(
                tap(resp => console.log(`created Evaluation title=${resp.title}`))
            );
    }

    update(evaluation: Evaluation): Observable<Evaluation> {
        const evaluationId = evaluation.id;
        const url = `${this.evaluationURL}/${evaluationId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Evaluation>(url, evaluation)
            .pipe(
                tap(resp => console.log(`edited Evaluation title=${resp.title}`))
            );
    }

    delete(evaluation: Evaluation | string): Observable<Evaluation> {
        const evaluationId = (typeof evaluation === 'string') ? evaluation : evaluation.id;
        const url = `${this.evaluationURL}/${evaluationId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Evaluation>(url)
            .pipe(
                tap(_ => console.log(`deleted Evaluation id=${evaluationId}`))
            );
    }

    getEvaluationById(id: string): Observable<Evaluation> {
        const url = `${this.evaluationURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Evaluation id=${id}`))
            );
    }

    getEvaluationByTitle(title: string): Observable<Evaluation> {
        const url = `${this.evaluationURL}${URI_TITLE}/${title}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Evaluation title=${title}`))
            );
    }


    getEvaluationsBySubject(id: string): Observable<Evaluation[]> {
        const url = `${this.evaluationURL}${URI_SUBJECTS}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Evaluation[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Evaluation: ${resp.length}`))
            );
    }
}
