import { Injectable } from '@angular/core';
import { SESSION_STORAGE_THEME_KEY } from '../app.config';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class SessionStorageService {

    private isThemeDarkSource = new Subject<boolean>();
    isThemeDark$ = this.isThemeDarkSource.asObservable();

    constructor() { }

    private themeParsed(): any {
        if (this.isStored(SESSION_STORAGE_THEME_KEY)) {
            const themeFullString: string = this.getItem(SESSION_STORAGE_THEME_KEY);
            return JSON.parse(themeFullString);
        }
    }

    getTheme(): string {
        return this.themeParsed().name;
    }

    isDarkTheme(): boolean {
        if (this.isStored(SESSION_STORAGE_THEME_KEY)) {
            //  console.log('darkTheme: ' + this.themeParsed().isDark);
           // this.isThemeDarkSource.next(this.themeParsed().isDark);
            return this.themeParsed().isDark;
        } else {
            return false;
        }
    }

    darkThemeNext(){
        this.isThemeDarkSource.next(this.themeParsed().isDark);
    }

    isStored(key: string): boolean {
        return (this.getItem(key) !== null);
    }

    getItem(key: string): any {
        return sessionStorage.getItem(key);
    }

    setItem(key: string, value: any): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    signOut() {
        sessionStorage.clear();
    }

}