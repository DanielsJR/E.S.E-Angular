import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { API_SERVER, URI_TOKEN_AUTH } from '../../app.config';
import { Token } from '../../models/token';


@Injectable()
export class LoginService {
    private endpoint = API_SERVER + URI_TOKEN_AUTH;
    isAuth = false;

    constructor(
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
        private httpCli: HttpClient
    ) { }

    login(username: string, password: string): Observable<Token> {
        const credentials = { username: username, password: password };
        console.log('login::...');
        return this.httpCli.post<Token>(this.endpoint, credentials);
    }

    logout(): void {
        this.localStorageService.clearLocalStorage();
        this.sessionStorageService.clearSessionStorage();
        this.isAuth = false;
    }


}
