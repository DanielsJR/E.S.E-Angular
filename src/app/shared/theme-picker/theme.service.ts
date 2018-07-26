import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Theme } from './theme';
import { API_SERVER } from '../../app.config';


@Injectable()
export class ThemeService {

    private themeURL = API_SERVER + '/preferences/theme';

    constructor(private httpCli: HttpClient) { }

    getTheme(id: string): Observable<Theme> {
        const url = `${this.themeURL}/${id}`;
        console.log(`resource called: ${url}`);
        return this.httpCli.get<Theme>(url)
            .pipe(
                tap(theme => console.log(`fetched theme: ${theme.name}`))
            );
    }

    saveTheme(id: string, theme: Theme): Observable<boolean> {
        const url = `${this.themeURL}/${id}`;
        console.log(`resource called:  ${url}`);
        return this.httpCli.put<boolean>(url, theme)
            .pipe(
                tap(resp => console.log(`theme ${theme.name} saved: ${resp}`))
            );
    }

}




