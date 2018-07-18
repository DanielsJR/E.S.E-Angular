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


    //**********--TOKEN--**************
    isTokenStored(): boolean {
        return (this.isStored(LOCAL_STORAGE_TOKEN_KEY));
    }

    getFullToken(): string {
        if (this.isTokenStored()) return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY).slice(1, -1);
        console.error('getFullToken() no token stored');
    }

    getExpireDate() {
        if(this.isTokenStored()) return decode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)).exp;
        console.error('getExpireDate() no token stored');
    }

    isTokenExpired(): boolean {
        if (this.isTokenStored()) return (this.getExpireDate() < (Date.now().valueOf() / 1000));
        console.error('isTokenExpired() no token stored');
        return true;
    }

    getTokenUsername(): string {
        if (this.isTokenStored()) return decode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)).sub;
        console.error('getTokenUsername() no token stored');
    }

    getTokenRoles(): string[] {
        let tokenPayload = (this.isTokenStored()) ? decode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)) : null;
        if (tokenPayload != null && !this.isTokenExpired()) return tokenPayload.scopes.replace(/ROLE_/g, '').split(",");
        console.error('getTokenRoles() tokenPayload: null or token expired');
        return [];
    }




}
