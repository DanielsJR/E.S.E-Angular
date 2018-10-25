import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user';
/*
 * Example:
 *   {{ user | shortNameLastname }}
 *   formats from:Lucho Juan Perez Gonzales to: Lucho Perez Gonzales
*/
@Pipe({ name: 'shortNameLastname' })
export class ShortNameLastnamePipe implements PipeTransform {
    transform(user: User): string {
        const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
        return n1 + ' ' + user.lastName;
    }
}