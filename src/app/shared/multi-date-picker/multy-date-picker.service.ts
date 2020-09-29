import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from "rxjs/internal/Subject";


@Injectable({
    providedIn: 'root',
})
export class MultiDatePickerService {

    private dateSource = <BehaviorSubject<Date>>new BehaviorSubject(new Date(new Date().getFullYear(), 0));


    constructor() { }

    get date$() {
        return this.dateSource.asObservable();
    }

    emitDate(date: Date) {
        this.dateSource.next(date);
    }

}