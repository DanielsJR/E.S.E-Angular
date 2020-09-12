import { Injectable } from '@angular/core';
import { SESSION_STORAGE_THEME_KEY } from '../app.config';
import { ReplaySubject, Observable } from 'rxjs';
import { Theme } from '../shared/theme-picker/theme';


@Injectable({
    providedIn: 'root',
})

export class SessionStorageService {
    private isThemeDarkSource = new ReplaySubject<boolean>(1);//Subject<boolean>();
    private isThemeinstalledSource = new ReplaySubject<boolean>(1);

    constructor() { }


    isStored(key: string): boolean {
        return (this.getItem(key));
    }

    getItem(key: string): any {
        return sessionStorage.getItem(key);
    }

    private setItem(key: string, value: any): void {
        //sessionStorage.setItem(key, JSON.stringify(value));
        sessionStorage.setItem(key, value);
    }

    private removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    clearSessionStorage() {
        sessionStorage.clear();
        this.themeInstalledNext();
    }



    //THEME**************************************


    getTheme(): Theme {
        return (this.isStored(SESSION_STORAGE_THEME_KEY)) ? JSON.parse(this.getItem(SESSION_STORAGE_THEME_KEY)) : null;
    }

    setTheme(theme: Theme): void {
        sessionStorage.setItem(SESSION_STORAGE_THEME_KEY, JSON.stringify(theme));
        this.themeInstalledNext();
    }

    removeTheme(): void {
        sessionStorage.removeItem(SESSION_STORAGE_THEME_KEY);
        this.themeInstalledNext();
    }

    isDarkTheme(): boolean {
        return (this.getTheme()) ? this.getTheme().dark : false;
    }

    get isThemeDark$(): Observable<boolean> {
        return this.isThemeDarkSource.asObservable();
    }

    darkThemeNext() {
        this.isThemeDarkSource.next(this.getTheme().dark);
    }

    get isThemeInstalled$(): Observable<boolean> {
        return this.isThemeinstalledSource.asObservable();
    }

    themeInstalledNext() {
        this.isThemeinstalledSource.next(!!this.getTheme());
    }




}