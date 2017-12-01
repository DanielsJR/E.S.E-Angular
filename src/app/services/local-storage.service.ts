import { Injectable } from '@angular/core';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';

@Injectable()
export class LocalStorageService {

    private tokenParsed(): any {
        if (this.isStored(LOCAL_STORAGE_TOKEN_KEY)) {
            const tokenFullString: string = this.getItem(LOCAL_STORAGE_TOKEN_KEY);
            return JSON.parse(tokenFullString);
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

}
