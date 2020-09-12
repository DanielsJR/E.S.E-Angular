import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Theme } from './theme';
import { API_BACKEND_SERVER, URI_THEME, URI_PREFERENCES } from '../../app.config';


@Injectable()
export class ThemeService {

    private themeURL = API_BACKEND_SERVER + URI_PREFERENCES + URI_THEME;

    constructor(private httpCli: HttpClient) { }

    getTheme(username: string): Observable<Theme> {
        const url = `${this.themeURL}/${username}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Theme>(url)
            .pipe(
                tap(theme => console.log(`fetched theme: ${theme.name}`),
                    err => console.error('Error getting Theme', err.error.exception)));
    }

    saveTheme(username: string, theme: Theme): Observable<Theme> {
        const url = `${this.themeURL}/${username}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<Theme>(url, theme)
            .pipe(
                tap(resp => console.log(`saved: ${resp.name}`)
                    , err => console.error('Error saving Theme', err.error.exception)));
    }

}




