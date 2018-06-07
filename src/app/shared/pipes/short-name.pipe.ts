import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../models/user';
/*
 * Example:
 *   {{ user | shortName }}
 *   formats from:Lucho Juan Perez Gonzales to: Lucho Perez
*/
@Pipe({ name: 'shortName' })
export class ShortNamePipe implements PipeTransform {
    transform(user: User): string {
        const n1 = user.firstName.substr(0, user.firstName.indexOf(' ')) || user.firstName;
        const n2 = user.lastName.substr(0, user.lastName.indexOf(' ')) || user.lastName;
        return n1 + ' ' + n2;
    }
}