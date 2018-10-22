import { Injectable } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";


@Injectable({
    providedIn: 'root',
})
export class IsLoadingService {

    private isLoading = new Subject<boolean>();
    isLoading$ = this.isLoading.asObservable();
    
    constructor() {
        this.isLoadingFalse();
    }

    isLoadingTrue() {
        this.isLoading.next(true);
    }

    isLoadingFalse() {
        this.isLoading.next(false);
    }
}