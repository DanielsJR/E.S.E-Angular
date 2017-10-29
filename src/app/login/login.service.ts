import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { Session } from '../models/session';
import { API_GENERIC_URI } from '../app.config';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { HTTPService } from '../services/http.service';

@Injectable()
export class LoginService {
    private endpoint = '/tokens';

    constructor(private httpService: HTTPService) { }

    login(mobile: number, password: string): Observable<Session> {
        const headers = new Headers({'Authorization': 'Basic ' + btoa(mobile + ':' + password)});
        return this.httpService.post(this.endpoint, null, headers);
    }
}
