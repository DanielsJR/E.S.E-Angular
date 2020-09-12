

import { tap } from "rxjs/internal/operators/tap";
import { IsLoadingService } from "./isLoadingService.service";
import { Attendance } from "../models/attendance";
import { AttendanceBackendService } from "./attendance-backend.service";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { finalize } from 'rxjs/internal/operators/finalize';
import { map } from 'rxjs/internal/operators/map';



@Injectable({
    providedIn: 'root',
})
export class AttendanceStoreService {
    private dataStore: { attendances: Attendance[] };
    private attendancesSource = <BehaviorSubject<Attendance[]>>new BehaviorSubject([]);
    private isLoadingGet = <BehaviorSubject<boolean>>new BehaviorSubject(false);

    constructor(
        private attendanceBackendService: AttendanceBackendService,
        private isLoadingService: IsLoadingService,
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
                    this.dataStore.attendances = data;
                    this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
                    if (data.length == 0) console.error('attendance list empty');
                });
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
                }));
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
                }));
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
                }));
    }


    clearStore() {
        console.log("****************Clearing attendanceStore******************");
        this.dataStore.attendances = [];
        this.attendancesSource.next(Object.assign({}, this.dataStore).attendances);
    }




}