import { Injectable } from "../../../node_modules/@angular/core";
import { API_SERVER, URI_ATTENDANCES, URI_SUBJECT } from "../app.config";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";
import { retry } from "../../../node_modules/rxjs/internal/operators/retry";
import { tap } from "../../../node_modules/rxjs/internal/operators/tap";
import { Attendance } from "../models/attendance";


@Injectable({
    providedIn: 'root',
})
export class AttendanceBackendService {


    private attendanceURL = API_SERVER + URI_ATTENDANCES;

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
