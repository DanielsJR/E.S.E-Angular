import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
    providedIn: 'root',
})
export class HomeUserService {

    private menuActionSource = <BehaviorSubject<string>>new BehaviorSubject('');

    constructor() { }

    get menuAction$() {
        return this.menuActionSource.asObservable();
    }

    emitAction(action: string) {
        this.menuActionSource.next(action);
    }
}