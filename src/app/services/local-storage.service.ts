import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { default as decode } from 'jwt-decode';
import { LOCAL_STORAGE_TOKEN_KEY } from '../app.config';


@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    constructor() { }

    isStored(key: string): boolean {
        return (this.getItem(key) !== null);
    }

    getItem(key: string): any {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    signOut() {
        localStorage.clear();
    }

    getFullToken(): string{
        return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY).slice(1, -1); 
    }

    getTokenRoles(): string[] {
        let tokenPayload = (this.isStored(LOCAL_STORAGE_TOKEN_KEY)) ? decode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)) : null;
        if (this.isStored(LOCAL_STORAGE_TOKEN_KEY) && tokenPayload != null) {
            return tokenPayload.scopes.replace(/ROLE_/g, '').split(",");
        }
    }

    getTokenUsername(): string {
        let tokenPayload = (this.isStored(LOCAL_STORAGE_TOKEN_KEY)) ? decode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)) : null;
        if (this.isStored(LOCAL_STORAGE_TOKEN_KEY) && tokenPayload != null) {
            return tokenPayload.sub
        };
    }



}
