import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_THEME_KEY } from '../../app.config';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class LocalStorageService {

    private isThemeDarkSource = new Subject<boolean>();
    isThemeDark$ = this.isThemeDarkSource.asObservable();

    private tokenParsed(): any {
        if (this.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            const tokenFullString: string = this.getItem(LOCAL_STORAGE_TOKEN_KEY);
            return JSON.parse(tokenFullString);
        }
    }


    private themeParsed(): any {
        if (this.isStored(LOCAL_STORAGE_THEME_KEY)) {
            const themeFullString: string = this.getItem(LOCAL_STORAGE_THEME_KEY);
            return JSON.parse(themeFullString);
        }
    }

    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getItem(key: string): any {
        return localStorage.getItem(key);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    isStored(key: string): boolean {
        return (this.getItem(key) !== null);
    }

    getToken(): string {
        return this.tokenParsed().token;
    }

    getRole(): string {
        return this.tokenParsed().rol.toString();
    }

    getToken64(): string {
        return btoa(this.getToken() + ':');
    }

    getTheme(): string {
        return this.themeParsed().name;
    }

    getIsDarkTheme(): boolean {
        if (this.isStored(LOCAL_STORAGE_THEME_KEY)) {
            console.log('darkTheme: ' + this.themeParsed().isDark);
            this.isThemeDarkSource.next(this.themeParsed().isDark);
            return this.themeParsed().isDark;
        } else {
            return false;
        }
    }


}
