import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class HomeUserService {

    latestAction: string;
    private menuActionSource = new Subject<string>();

    constructor() { }

    get menuAction$() {
        return this.menuActionSource.asObservable();
    }

    emitAction(action: string) {
        this.latestAction = action;
        this.menuActionSource.next(action);
    }
}