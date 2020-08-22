
import { API_BACKEND_SERVER, URI_ATTENDANCE, URI_SUBJECT } from "../app.config";
import { Attendance } from "../models/attendance";
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { retry } from 'rxjs/internal/operators/retry';
import { tap } from 'rxjs/internal/operators/tap';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root',
})
export class AttendanceBackendService {


    private attendanceURL = API_BACKEND_SERVER + URI_ATTENDANCE;

    constructor(private httpCli: HttpClient) { }


    getAttendances(subjectId: string): Observable<Attendance[]> {
        const url = `${this.attendanceURL}${URI_SUBJECT}/${subjectId}`;
        console.log(`resource called: ${url}`)
        return this.httpCli.get<Attendance[]>(url)
            .pipe(retry(3),
                tap(attendances => console.log(`N° Attendances: ${attendances.length}`))
            );
    }

    create(attendance: Attendance): Observable<Attendance> {
        const url = `${this.attendanceURL}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.post<Attendance>(url, attendance)
            .pipe(
                tap(resp => console.log(`created Attendance id =${resp.id}`))
            );
    }

    update(attendance: Attendance): Observable<Attendance> {
        const attendanceId = attendance.id;
        const url = `${this.attendanceURL}/${attendanceId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Attendance>(url, attendance)
            .pipe(
                tap(resp => console.log(`edited Attendance id =${resp.id}`))
            );
    }

    delete(attendance: Attendance | string): Observable<Attendance> {
        const attendanceId = (typeof attendance === 'string') ? attendance : attendance.id;
        const url = `${this.attendanceURL}/${attendanceId}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.delete<Attendance>(url)
            .pipe(
                tap(_ => console.log(`deleted Attendance id =${attendanceId}`))
            );
    }

    getAttendanceById(id: string): Observable<Attendance> {
        const url = `${this.attendanceURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Attendance>(url)
            .pipe(retry(3),
                tap(a => console.log(`fetched Attendance id =${a.id}`))
            );
    }

}
