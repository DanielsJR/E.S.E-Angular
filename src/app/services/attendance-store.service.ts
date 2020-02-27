import { Injectable } from "../../../node_modules/@angular/core";
import { BehaviorSubject, Observable } from "../../../node_modules/rxjs";
import { finalize } from "../../../node_modules/rxjs/internal/operators/finalize";
import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { map } from "rxjs/operators";
import { Attendance } from "../models/attendance";
import { AttendanceBackendService } from "./attendance-backend.service";



@Injectable({
    providedIn: 'root',
})
export class AttendanceStoreService {
    private dataStore: { attendances: Attendance[] };
    private attendancesSource = <BehaviorSubject<Attendance[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(private attendanceBackendService: AttendanceBackendService, private isLoadingService: IsLoadingService,
    ) {
        this.dataStore = { attendances: [] };
    }

    get attendances$() {
        return this.attendancesSource.asObservable();
    }

    get isLoadingGetAttendances$() {
        return this.isLoadingGet.asObservable();
    }

    getAttendancesBySubject(subjectId: string) {
        if (this.attendancesSource.getValue().length) {
            console.log(`********GET-Attendances-FROM-CACHE********`);
            this.attendancesSource.next(this.dataStore.attendances);
        } else {
            console.log(`********GET-Attendances-FROM-BACKEND********`);
            this.isLoadingGet.next(true);
            this.attendanceBackendService.getAttendances(subjectId)
                .pipe(finalize(() => this.isLoadingGet.next(false)))
                .subscribe(data => {
                    if (data.length) {
                        this.dataStore.attendances = data;
                        this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
                    } else {
                        data = null;
                        console.error('Lista de attendances vacia');
                    }
                }, error => console.error('error retrieving attendances, ' + error.message)
                );
        }

    }

    loadOneAttendanceByDate(date: string): Observable<Attendance> {
        return this.attendances$
            .pipe(map(as => as.find(a => a.date === date)));
    }

    create(attendance: Attendance): Observable<Attendance> {
        this.isLoadingService.isLoadingTrue();
        return this.attendanceBackendService.create(attendance)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    this.dataStore.attendances.push(data);
                    this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
                }, error => console.error('could not create attendance, ' + error.message)
                ));
    }

    update(attendance: Attendance): Observable<Attendance> {
        this.isLoadingService.isLoadingTrue();
        return this.attendanceBackendService.update(attendance)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(data => {
                    let index = this.dataStore.attendances.findIndex(a => a.id === data.id);
                    if (index != -1) {
                        this.dataStore.attendances[index] = data;
                        this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
                    }
                }, err => console.error("Error updating attendance" + err.message)
                ));
    }

    delete(attendance: Attendance | string): Observable<Attendance> {
        this.isLoadingService.isLoadingTrue();
        return this.attendanceBackendService.delete(attendance)
            .pipe(
                finalize(() => this.isLoadingService.isLoadingFalse()),
                tap(_ => {
                    let index = this.dataStore.attendances.findIndex((c: Attendance) => c.id === ((typeof attendance === 'string') ? attendance : attendance.id));
                    if (index != -1) {
                        this.dataStore.attendances.splice(index, 1);
                        this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
                    }
                }, err => console.error("Error deleting attendance" + err.message)
                ));
    }


    clearStore() {
        console.log("****************Clearing attendanceStore******************");
        this.dataStore.attendances = [];
        this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
    }




}