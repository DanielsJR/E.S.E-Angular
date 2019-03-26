import { Injectable } from '@angular/core';
//import { default as decode } from 'jwt-decode';
import { LOCAL_STORAGE_TOKEN_KEY, ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT } from '../app.config';
import * as decode from 'jwt-decode';


@Injectable({
    providedIn: 'root',
})

export class LocalStorageService {


    jwtDecode = decode;

    constructor() { }

    isStored(key: string): boolean {
        return (this.getItem(key) !== null);
    }

    getItem(key: string): any {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: any): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clearLocalStorage() {
        localStorage.clear();
    }


    //**********--TOKEN--**************

    setToken(token: string): void {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    }


    isTokenStored(): boolean {
        return (this.isStored(LOCAL_STORAGE_TOKEN_KEY));
    }

    getToken(): string {
        return (this.isTokenStored()) ? this.getItem(LOCAL_STORAGE_TOKEN_KEY) : null;
    }

    getExpireDate() {
        return (this.isTokenStored()) ? this.jwtDecode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)).exp : null;
    }

    isTokenExpired(): boolean {
        if (this.isTokenStored()) return (this.getExpireDate() < (Date.now().valueOf() / 1000));
        return true;
    }

    getTokenUsername(): string {
        return (this.isTokenStored()) ? this.jwtDecode(this.getItem(LOCAL_STORAGE_TOKEN_KEY)).sub : null;
    }

    private getTokenRolesSplited() {
        let paidLoad = this.jwtDecode(this.getItem(LOCAL_STORAGE_TOKEN_KEY));
        return paidLoad.scopes.replace(/ROLE_/g, '').split(",");
    }

    sortRoles(array: string[]): string[] {
        let pattern = [ROLE_ADMIN, ROLE_MANAGER, ROLE_TEACHER, ROLE_STUDENT];
        return array.sort((a, b) => {
            if (pattern.indexOf(a) === pattern.indexOf(b))
                return 0;
            return pattern.indexOf(a) > pattern.indexOf(b) ? 1 : -1;
        });
    }

    getTokenRoles(): string[] {
        if (!this.isTokenExpired()) {
            return this.sortRoles(this.getTokenRolesSplited());
        } else {
            return [];
        }
    }




}
