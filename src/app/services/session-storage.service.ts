import { Injectable } from '@angular/core';
import { SESSION_STORAGE_THEME_KEY } from '../app.config';
import { Subject } from 'rxjs';
import { Theme } from '../shared/theme-picker/theme';


@Injectable({
    providedIn: 'root',
})

export class SessionStorageService {
    private isThemeDarkSource = new Subject<boolean>();
    isThemeDark$ = this.isThemeDarkSource.asObservable();

    constructor() { }

    isStored(key: string): boolean {
        return (this.getItem(key) !== null);
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

    getTheme(): Theme {
        return (this.isStored(SESSION_STORAGE_THEME_KEY)) ? JSON.parse(this.getItem(SESSION_STORAGE_THEME_KEY)) : null;
    }

    setTheme(key: string, theme: Theme): void {
        sessionStorage.setItem(key, JSON.stringify(theme));
    }

    isDarkTheme(): boolean {
        return (this.getTheme()) ? this.getTheme().isDark : false;
    }

    darkThemeNext() {
        this.isThemeDarkSource.next(this.getTheme().isDark);
    }



}