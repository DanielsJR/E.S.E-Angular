import { Injectable } from "@angular/core";
import { API_SERVER, URI_SUBJECTS } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Subject } from "../models/subject";


@Injectable({
    providedIn: 'root',
})
export class SubjectBackendService {


    private subjectURL = API_SERVER + URI_SUBJECTS;

    constructor(private httpCli: HttpClient) { }


    getSubjects(): Observable<Subject[]> {
        const url = `${this.subjectURL}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`))
            );
    }

    create(subject: Subject): Observable<Subject> {
        const url = `${this.subjectURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Subject>(url, subject)
            .pipe(
                tap(resp => console.log(`created Subject name=${resp.name}`))
            );
    }

    update(subject: Subject): Observable<Subject> {
        const subjectId = subject.id;
        const url = `${this.subjectURL}/${subjectId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Subject>(url, subject)
            .pipe(
                tap(resp => console.log(`edited Subject Subjectname=${resp.name}`))
            );
    }

    delete(subject: Subject | string): Observable<boolean> {
        const subjectName = (typeof subject === 'string') ? subject : subject.id;
        const url = `${this.subjectURL}/${subjectName}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<boolean>(url)
            .pipe(
                tap(_ => console.log(`deleted Subject id=${subjectName}`))
            );
    }

    getSubjectById(id: string): Observable<Subject> {
        const url = `${this.subjectURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Subject id=${id}`))
            );
    }

    getSubjectByName(name: string): Observable<Subject> {
        const url = `${this.subjectURL}/name/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Subject name=${name}`))
            );
    }

    getSubjectByTeacher(id: string): Observable<Subject> {
        const url = `${this.subjectURL}/teacher/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Subject name=${name}`))
            );
    }

    getSubjectsByTeacher(id: string): Observable<Subject[]> {
        const url = `${this.subjectURL}/teacher/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`))
            );
    }
}
