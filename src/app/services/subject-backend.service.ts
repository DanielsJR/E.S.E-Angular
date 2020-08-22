import { Injectable } from "@angular/core";
import { API_BACKEND_SERVER, URI_SUBJECT, URI_NAME, URI_TEACHER, URI_YEAR, URI_COURSE, URI_USER, URI_USERNAME } from "../app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { retry } from "rxjs/internal/operators/retry";
import { tap } from "rxjs/internal/operators/tap";
import { Subject } from "../models/subject";


@Injectable({
    providedIn: 'root',
})
export class SubjectBackendService {

    private subjectURL = API_BACKEND_SERVER + URI_SUBJECT;

    constructor(private httpCli: HttpClient) { }


    getSubjectsByYear(year: string): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_YEAR}/${year}`;
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

    delete(subject: Subject | string): Observable<Subject> {
        const subjectId = (typeof subject === 'string') ? subject : subject.id;
        const url = `${this.subjectURL}/${subjectId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Subject>(url)
            .pipe(
                tap(_ => console.log(`deleted Subject id=${subjectId}`))
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
        const url = `${this.subjectURL}${URI_NAME}/${name}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject>(url)
            .pipe(retry(3),
                tap(_ => console.log(`fetched Subject name=${name}`))
            );
    }

    getSubjectsByTeacherAndYear(username: string, year: string): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_TEACHER}/${username}/${year}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`))
            );
    }

    getStudentSubjectsByCourse(id: string, username: string,): Observable<Subject[]> {
        const url = `${this.subjectURL}${URI_COURSE}/${id}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Subject[]>(url)
            .pipe(retry(3),
                tap(resp => console.log(`N° Subjects: ${resp.length}`))
            );
    }
}
