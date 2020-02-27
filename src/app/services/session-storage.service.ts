import { Injectable } from '@angular/core';
import { SESSION_STORAGE_THEME_KEY } from '../app.config';
import { ReplaySubject, Observable } from 'rxjs';
import { Theme } from '../shared/theme-picker/theme';


@Injectable({
    providedIn: 'root',
})

export class SessionStorageService {
    private isThemeDarkSource = new ReplaySubject<boolean>(1);//Subject<boolean>();

    constructor() { }


    isStored(key: string): boolean {
        return (this.getItem(key));
    }

    getItem(key: string): any {
        return sessionStorage.getItem(key);
    }

    setItem(key: string, value: any): void {
        //sessionStorage.setItem(key, JSON.stringify(value));
        sessionStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clearSessionStorage() {
        sessionStorage.clear();
    }



    //THEME**************************************

    get isThemeDark$(): Observable<boolean> {
        return this.isThemeDarkSource.asObservable();
    }

    getTheme(): Theme {
        return (this.isStored(SESSION_STORAGE_THEME_KEY)) ? JSON.parse(this.getItem(SESSION_STORAGE_THEME_KEY)) : null;
   }

    setTheme(theme: Theme): void {
        sessionStorage.setItem(SESSION_STORAGE_THEME_KEY, JSON.stringify(theme));
    }

    removeTheme(): void {
        sessionStorage.removeItem(SESSION_STORAGE_THEME_KEY);
    }

    isDarkTheme(): boolean {
        return (this.getTheme()) ? this.getTheme().isDark : false;
    }

    darkThemeNext() {
        this.isThemeDarkSource.next(this.getTheme().isDark);
    }



}